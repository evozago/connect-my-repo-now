import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { FormLayout, FormSection, FormFieldGroup } from "../../components/forms/FormLayout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Textarea } from "../../components/ui/textarea";
import EntityDocumentField from "../../components/EntityDocumentField";
import { onlyDigits } from "../../utils/br-doc";
import { useToast } from "../../hooks/use-toast";
import { User, Building, Mail, Phone, FileText } from "lucide-react";

type EntidadeForm = {
  nome: string;
  tipo_pessoa: "FISICA" | "JURIDICA";
  documento?: string;
  email?: string;
  telefone?: string;
  ativo: boolean;
  observacoes?: string;
};

export default function NovaEntidadeEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<EntidadeForm>({
    defaultValues: {
      nome: "",
      tipo_pessoa: "FISICA",
      documento: "",
      email: "",
      telefone: "",
      ativo: true,
      observacoes: "",
    },
  });

  const { handleSubmit, control, watch, formState: { isSubmitting } } = form;
  const tipoPessoa = watch("tipo_pessoa");

  const onSubmit = async (data: EntidadeForm) => {
    try {
      // Normalize document (only digits); if empty, set to null
      const docDigits = onlyDigits(data.documento || "");
      
      const payload = {
        nome: data.nome.trim(),
        tipo_pessoa: data.tipo_pessoa,
        documento: docDigits || null,
        email: data.email?.trim() || null,
        telefone: data.telefone?.trim() || null,
        ativo: data.ativo,
        metadados: data.observacoes ? { observacoes: data.observacoes } : null,
      };

      const { error } = await supabase.from("entidades").insert(payload);
      
      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Entidade criada com sucesso",
      });

      navigate("/entidades");
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <FormLayout
      title="Nova Entidade"
      description="Cadastre uma nova pessoa física ou jurídica no sistema"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      backUrl="/entidades"
      submitLabel="Criar Entidade"
    >
      <Form {...form}>
        <div className="space-y-8">
          {/* Basic Information */}
          <FormSection
            title="Informações Básicas"
            description="Dados principais da entidade"
          >
            <FormFieldGroup columns={2}>
              <FormField
                control={control}
                name="nome"
                rules={{ required: "Nome é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {tipoPessoa === "FISICA" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Building className="h-4 w-4" />
                      )}
                      Nome {tipoPessoa === "FISICA" ? "Completo" : "da Empresa"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={
                          tipoPessoa === "FISICA" 
                            ? "Digite o nome completo" 
                            : "Digite o nome da empresa"
                        }
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="tipo_pessoa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Pessoa</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FISICA">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Pessoa Física
                          </div>
                        </SelectItem>
                        <SelectItem value="JURIDICA">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Pessoa Jurídica
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormFieldGroup>

            <FormFieldGroup columns={1}>
              <div>
                <EntityDocumentField 
                  control={control} 
                  name="documento" 
                  required={false}
                  label={tipoPessoa === "FISICA" ? "CPF" : "CNPJ"}
                  placeholder={
                    tipoPessoa === "FISICA" 
                      ? "000.000.000-00" 
                      : "00.000.000/0000-00"
                  }
                />
              </div>
            </FormFieldGroup>
          </FormSection>

          {/* Contact Information */}
          <FormSection
            title="Informações de Contato"
            description="Dados para comunicação com a entidade"
          >
            <FormFieldGroup columns={2}>
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="exemplo@email.com"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(00) 00000-0000"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormFieldGroup>
          </FormSection>

          {/* Additional Information */}
          <FormSection
            title="Informações Adicionais"
            description="Configurações e observações sobre a entidade"
          >
            <FormFieldGroup columns={1}>
              <FormField
                control={control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Entidade Ativa
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Entidades inativas não aparecerão em listagens por padrão
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Observações
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informações adicionais sobre a entidade..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormFieldGroup>
          </FormSection>
        </div>
      </Form>
    </FormLayout>
  );
}