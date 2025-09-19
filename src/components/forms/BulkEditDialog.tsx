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

interface BulkEditDialogProps<T> {
  open: boolean;
  onClose: () => void;
  onSave: (data: BulkEditData) => void;
  selectedItems: T[];
  fields: BulkEditField[];
  isLoading?: boolean;
}

export interface BulkEditField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'textarea' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface BulkEditData {
  [key: string]: any;
}

export function BulkEditDialog<T>({
  open,
  onClose,
  onSave,
  selectedItems,
  fields,
  isLoading = false,
}: BulkEditDialogProps<T>) {
  const [formData, setFormData] = useState<BulkEditData>({});

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Only send fields that have been modified
    const modifiedData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== undefined && value !== "")
    );
    onSave(modifiedData);
  };

  const handleClear = () => {
    setFormData({});
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edição em Massa</DialogTitle>
          <DialogDescription>
            {selectedItems.length} parcela(s) selecionada(s). Apenas os campos preenchidos serão atualizados.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              
              {field.type === 'text' && (
                <Input
                  id={field.key}
                  placeholder={field.placeholder || `${field.label}...`}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                />
              )}

              {field.type === 'number' && (
                <Input
                  id={field.key}
                  type="number"
                  placeholder={field.placeholder || `${field.label}...`}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                />
              )}

              {field.type === 'select' && field.options && (
                <Select
                  value={formData[field.key] || ""}
                  onValueChange={(value) => handleFieldChange(field.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Selecionar ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === 'date' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData[field.key] && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData[field.key] ? (
                        format(new Date(formData[field.key]), "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecionar data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData[field.key] ? new Date(formData[field.key]) : undefined}
                      onSelect={(date) => handleFieldChange(field.key, date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}

              {field.type === 'textarea' && (
                <Textarea
                  id={field.key}
                  placeholder={field.placeholder || `${field.label}...`}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  rows={3}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClear}>
            Limpar
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Atualizando..." : `Atualizar ${selectedItems.length} Parcela(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}