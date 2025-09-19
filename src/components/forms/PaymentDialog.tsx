import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface PaymentDialogProps<T> {
  open: boolean;
  onClose: () => void;
  onSave: (payments: PaymentData[]) => void;
  selectedItems: T[];
  isLoading?: boolean;
}

export interface PaymentData {
  id: string;
  originalValue: number;
  paidValue: number;
  paymentDate: string;
  paymentMethod: string;
  bank: string;
  identifier: string;
  observations?: string;
}

const paymentMethods = [
  { value: "pix", label: "PIX" },
  { value: "ted", label: "TED" },
  { value: "doc", label: "DOC" },
  { value: "boleto", label: "Boleto" },
  { value: "cartao", label: "Cartão" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cheque", label: "Cheque" },
];

const banks = [
  { value: "001", label: "Banco do Brasil" },
  { value: "104", label: "Caixa Econômica Federal" },
  { value: "237", label: "Bradesco" },
  { value: "341", label: "Itaú" },
  { value: "033", label: "Santander" },
  { value: "745", label: "Citibank" },
  { value: "399", label: "HSBC" },
  { value: "outro", label: "Outro" },
];

export function PaymentDialog<T extends { id: string; valor_parcela: number; descricao?: string }>({
  open,
  onClose,
  onSave,
  selectedItems,
  isLoading = false,
}: PaymentDialogProps<T>) {
  const [payments, setPayments] = useState<PaymentData[]>(() =>
    selectedItems.map(item => ({
      id: item.id,
      originalValue: item.valor_parcela,
      paidValue: item.valor_parcela,
      paymentDate: new Date().toISOString(),
      paymentMethod: "",
      bank: "",
      identifier: "",
      observations: "",
    }))
  );
  const [globalObservations, setGlobalObservations] = useState("");

  const updatePayment = (id: string, field: keyof PaymentData, value: any) => {
    setPayments(prev =>
      prev.map(payment =>
        payment.id === id ? { ...payment, [field]: value } : payment
      )
    );
  };

  const handleSave = () => {
    const finalPayments = payments.map(payment => ({
      ...payment,
      observations: payment.observations || globalObservations,
    }));
    onSave(finalPayments);
  };

  const totalOriginal = payments.reduce((sum, p) => sum + p.originalValue, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.paidValue, 0);
  const difference = totalPaid - totalOriginal;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            💰 Pagamento em Lote
          </DialogTitle>
          <DialogDescription>
            {selectedItems.length} conta(s) selecionada(s) para pagamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo do Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Total Original:</Label>
                  <p className="text-xl font-semibold">
                    R$ {totalOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Total a Pagar:</Label>
                  <p className="text-xl font-semibold">
                    R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Diferença:</Label>
                  <p className={`text-xl font-semibold ${difference > 0 ? 'text-red-600' : difference < 0 ? 'text-green-600' : ''}`}>
                    {difference > 0 ? '+' : ''}R$ {difference.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {difference !== 0 && (
                    <Badge variant={difference > 0 ? "destructive" : "default"} className="mt-1">
                      {difference > 0 ? "Juros" : "Desconto"}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Payments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contas para Pagamento</h3>
            {payments.map((payment, index) => {
              const item = selectedItems.find(i => i.id === payment.id);
              return (
                <Card key={payment.id}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">
                      {item?.descricao || `Conta ${index + 1}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label>Original</Label>
                        <div className="p-2 bg-muted rounded text-sm">
                          R$ {payment.originalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`paid-${payment.id}`}>Pago *</Label>
                        <Input
                          id={`paid-${payment.id}`}
                          type="number"
                          step="0.01"
                          value={payment.paidValue}
                          onChange={(e) => updatePayment(payment.id, 'paidValue', parseFloat(e.target.value) || 0)}
                          className="font-semibold"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`date-${payment.id}`}>Data de Pagamento *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !payment.paymentDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {payment.paymentDate ? (
                                format(new Date(payment.paymentDate), "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecionar data</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={payment.paymentDate ? new Date(payment.paymentDate) : undefined}
                              onSelect={(date) => updatePayment(payment.id, 'paymentDate', date?.toISOString())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor={`identifier-${payment.id}`}>Código Identificador</Label>
                        <Input
                          id={`identifier-${payment.id}`}
                          placeholder="Ex: TED123"
                          value={payment.identifier}
                          onChange={(e) => updatePayment(payment.id, 'identifier', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`method-${payment.id}`}>Forma de Pagamento *</Label>
                        <Select
                          value={payment.paymentMethod}
                          onValueChange={(value) => updatePayment(payment.id, 'paymentMethod', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar forma" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.value} value={method.value}>
                                {method.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`bank-${payment.id}`}>Banco Pagador *</Label>
                        <Select
                          value={payment.bank}
                          onValueChange={(value) => updatePayment(payment.id, 'bank', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar banco" />
                          </SelectTrigger>
                          <SelectContent>
                            {banks.map((bank) => (
                              <SelectItem key={bank.value} value={bank.value}>
                                {bank.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Global Observations */}
          <div className="space-y-2">
            <Label htmlFor="global-obs">Observações</Label>
            <Textarea
              id="global-obs"
              placeholder="Ex: Pagamento via PIX, desconto por antecipação, juros por atraso, etc."
              value={globalObservations}
              onChange={(e) => setGlobalObservations(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Processando..." : `Confirmar Pagamento (${selectedItems.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}