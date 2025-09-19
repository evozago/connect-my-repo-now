import React, { useState } from "react";
import { DataTable, DataTableColumn } from "../../components/ui/data-table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { BulkEditDialog, BulkEditField } from "../../components/forms/BulkEditDialog";
import { PaymentDialog } from "../../components/forms/PaymentDialog";
import { useToast } from "../../hooks/use-toast";
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
  forma_pagto?: string;
  doc_pagto?: string;
  pago_em?: string;
  credor?: {
    nome: string;
  };
}

// Mock data for demonstration
const mockData: ContaPagar[] = [
  {
    id: "1",
    descricao: "MUNDO KIDS LTDA",
    valor_parcela: 4543,
    data_vencimento: "2024-05-05",
    status: "a_vencer",
    credor: { nome: "MUNDO KIDS LTDA" }
  },
  {
    id: "2", 
    descricao: "GRENDENE S/A - FILIAL 5 (FOR)",
    valor_parcela: 1714747,
    data_vencimento: "2024-06-15",
    status: "vencido",
    credor: { nome: "GRENDENE S/A" }
  },
  {
    id: "3",
    descricao: "KYLY INDUSTRIA TEXTIL LTDA",
    valor_parcela: 3853506,
    data_vencimento: "2024-04-20",
    status: "pago",
    forma_pagto: "pix",
    pago_em: "2024-04-18",
    credor: { nome: "KYLY INDUSTRIA TEXTIL LTDA" }
  },
  {
    id: "4",
    descricao: "MON SUCRE CONFECCOES LTDA",
    valor_parcela: 214201,
    data_vencimento: "2024-07-10",
    status: "a_vencer",
    credor: { nome: "MON SUCRE CONFECCOES LTDA" }
  },
  {
    id: "5",
    descricao: "TEMPO DE CRIANCA MODA INFANTIL LTDA",
    valor_parcela: 127805,
    data_vencimento: "2024-05-25",
    status: "vencido",
    credor: { nome: "TEMPO DE CRIANCA MODA INFANTIL LTDA" }
  }
];

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

export default function ContasListaDemo() {
  const [contas, setContas] = useState<ContaPagar[]>(mockData);
  const [selectedItems, setSelectedItems] = useState<ContaPagar[]>([]);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const columns: DataTableColumn<ContaPagar>[] = [
    {
      key: "descricao",
      title: "Fornecedor",
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
      title: "Valor da Parcela",
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
  ];

  const handleBulkEdit = async (data: any) => {
    try {
      setIsUpdating(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedContas = contas.map(conta => {
        if (selectedItems.some(item => item.id === conta.id)) {
          return { ...conta, ...data };
        }
        return conta;
      });
      
      setContas(updatedContas);

      toast({
        title: "Sucesso",
        description: `${selectedItems.length} parcela(s) atualizada(s) com sucesso`,
      });

      setBulkEditOpen(false);
      setSelectedItems([]);
    } catch (error) {
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

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedContas = contas.map(conta => {
        const payment = payments.find(p => p.id === conta.id);
        if (payment) {
          return {
            ...conta,
            status: "pago",
            valor_parcela: payment.paidValue,
            pago_em: payment.paymentDate,
            forma_pagto: payment.paymentMethod,
            doc_pagto: payment.identifier,
          };
        }
        return conta;
      });

      setContas(updatedContas);

      toast({
        title: "Sucesso",
        description: `${payments.length} pagamento(s) processado(s) com sucesso`,
      });

      setPaymentDialogOpen(false);
      setSelectedItems([]);
    } catch (error) {
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const idsToDelete = items.map(item => item.id);
      const updatedContas = contas.filter(conta => !idsToDelete.includes(conta.id));
      
      setContas(updatedContas);

      toast({
        title: "Sucesso",
        description: `${items.length} parcela(s) excluída(s) com sucesso`,
      });

      setSelectedItems([]);
    } catch (error) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas a Pagar</h1>
          <p className="text-muted-foreground">
            Sistema completo com seleção múltipla, edição em massa e processamento de pagamentos
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-blue-800">
          💡 Como usar este sistema:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 font-bold">✓</span>
            <span>Use as caixas de seleção para escolher itens</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-500 font-bold">✓</span>
            <span>Segure <kbd className="px-2 py-1 text-xs bg-blue-100 border border-blue-300 rounded shadow-sm font-mono">Shift</kbd> + clique para seleção em intervalo</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-500 font-bold">✓</span>
            <span>Use "Editar em Massa" para alterar múltiplos campos</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-500 font-bold">✓</span>
            <span>Use "Marcar como Pago" para processar pagamentos individualizados</span>
          </div>
        </div>
      </div>

      <DataTable
        data={contas}
        columns={columns}
        loading={false}
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