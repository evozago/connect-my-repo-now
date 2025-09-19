import React, { useState, useEffect } from "react";
import { DataTable, DataTableColumn } from "../../components/ui/data-table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { BulkEditDialog, BulkEditField } from "../../components/forms/BulkEditDialog";
import { PaymentDialog } from "../../components/forms/PaymentDialog";
import { useToast } from "../../hooks/use-toast";
import { supabase } from "../../integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

interface ContaPagar {
  id: string;
  descricao: string;
  valor_parcela: number;
  data_vencimento: string;
  status: string;
  forma_pagto?: string | null;
  doc_pagto?: string | null;
  pago_em?: string | null;
  credor?: {
    nome: string;
  };
}

const bulkEditFields: BulkEditField[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "a_vencer", label: "A Vencer" },
      { value: "vencido", label: "Vencido" },
      { value: "pago", label: "Pago" },
    ],
  },
  {
    key: "forma_pagto",
    label: "Forma de Pagamento",
    type: "select",
    options: [
      { value: "pix", label: "PIX" },
      { value: "ted", label: "TED" },
      { value: "doc", label: "DOC" },
      { value: "boleto", label: "Boleto" },
      { value: "cartao", label: "Cartão" },
    ],
  },
  {
    key: "data_vencimento",
    label: "Nova Data de Vencimento",
    type: "date",
  },
  {
    key: "observacoes",
    label: "Observações",
    type: "textarea",
    placeholder: "Observações adicionais...",
  },
];

export default function ContasListaEnhanced() {
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<ContaPagar[]>([]);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const columns: DataTableColumn<ContaPagar>[] = [
    {
      key: "descricao",
      title: "Descrição",
      render: (item) => (
        <div>
          <div className="font-medium">{item.descricao}</div>
          {item.credor && (
            <div className="text-sm text-muted-foreground">{item.credor.nome}</div>
          )}
        </div>
      ),
    },
    {
      key: "valor_parcela",
      title: "Valor",
      align: "right",
      render: (item) => (
        <span className="font-medium">
          R$ {item.valor_parcela.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "data_vencimento",
      title: "Vencimento",
      render: (item) => format(new Date(item.data_vencimento), "dd/MM/yyyy", { locale: ptBR }),
    },
    {
      key: "status",
      title: "Status",
      render: (item) => (
        <Badge
          variant={
            item.status === "pago"
              ? "default"
              : item.status === "vencido"
              ? "destructive"
              : "secondary"
          }
        >
          {item.status === "pago" ? "Pago" : item.status === "vencido" ? "Vencido" : "A Vencer"}
        </Badge>
      ),
    },
    {
      key: "forma_pagto",
      title: "Forma Pagamento",
      render: (item) => item.forma_pagto || "-",
    },
    {
      key: "pago_em",
      title: "Data Pagamento",
      render: (item) =>
        item.pago_em ? format(new Date(item.pago_em), "dd/MM/yyyy", { locale: ptBR }) : "-",
    },
  ];

  useEffect(() => {
    loadContas();
  }, []);

  const loadContas = async () => {
    try {
      setLoading(true);
      
      // Simplified query without complex joins for now
      const { data, error } = await supabase
        .from("parcelas_conta_pagar")
        .select("*")
        .order("data_vencimento", { ascending: false });

      if (error) throw error;

      const mappedData = data?.map(item => ({
        id: item.id.toString(),
        descricao: `Parcela ${item.num_parcela || 1}`, // Fallback description
        valor_parcela: Number(item.valor_parcela),
        data_vencimento: item.data_vencimento,
        status: item.status,
        forma_pagto: item.forma_pagto,
        doc_pagto: item.doc_pagto,
        pago_em: item.pago_em,
        credor: undefined, // Will be populated later with proper join
      })) || [];

      setContas(mappedData);
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as contas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkEdit = async (data: any) => {
    try {
      setIsUpdating(true);
      
      const ids = selectedItems.map(item => parseInt(item.id));
      
      const { error } = await supabase
        .from("parcelas_conta_pagar")
        .update(data)
        .in("id", ids);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${selectedItems.length} parcela(s) atualizada(s) com sucesso`,
      });

      setBulkEditOpen(false);
      setSelectedItems([]);
      loadContas();
    } catch (error) {
      console.error("Erro na edição em massa:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as parcelas",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePayments = async (payments: any[]) => {
    try {
      setIsUpdating(true);

      for (const payment of payments) {
        const { error } = await supabase
          .from("parcelas_conta_pagar")
          .update({
            status: "pago",
            valor_parcela: payment.paidValue,
            pago_em: payment.paymentDate,
            forma_pagto: payment.paymentMethod,
            doc_pagto: payment.identifier,
          })
          .eq("id", parseInt(payment.id));

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: `${payments.length} pagamento(s) processado(s) com sucesso`,
      });

      setPaymentDialogOpen(false);
      setSelectedItems([]);
      loadContas();
    } catch (error) {
      console.error("Erro no processamento dos pagamentos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar os pagamentos",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (items: ContaPagar[]) => {
    if (!confirm(`Deseja realmente excluir ${items.length} parcela(s)?`)) return;

    try {
      setIsUpdating(true);
      
      const ids = items.map(item => parseInt(item.id));
      
      const { error } = await supabase
        .from("parcelas_conta_pagar")
        .delete()
        .in("id", ids);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${items.length} parcela(s) excluída(s) com sucesso`,
      });

      setSelectedItems([]);
      loadContas();
    } catch (error) {
      console.error("Erro ao excluir parcelas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir as parcelas",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contas a Pagar</h1>
          <p className="text-muted-foreground">
            Gerencie suas contas a pagar com seleção múltipla e edição em massa
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      <DataTable
        data={contas}
        columns={columns}
        loading={loading}
        selectable={true}
        onSelectionChange={setSelectedItems}
        bulkActions={{
          onEdit: () => setBulkEditOpen(true),
          onMarkAsPaid: () => setPaymentDialogOpen(true),
          onDelete: handleDelete,
        }}
        actions={(item) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Visualizar</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <BulkEditDialog
        open={bulkEditOpen}
        onClose={() => setBulkEditOpen(false)}
        onSave={handleBulkEdit}
        selectedItems={selectedItems}
        fields={bulkEditFields}
        isLoading={isUpdating}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        onSave={handlePayments}
        selectedItems={selectedItems}
        isLoading={isUpdating}
      />
    </div>
  );
}