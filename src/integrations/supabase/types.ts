export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contas_pagar_corporativas: {
        Row: {
          categoria_id: number | null
          credor_id: number | null
          criado_em: string
          descricao: string
          dt_emissao: string | null
          dt_vencimento: string | null
          filial_id: number
          id: number
          observacoes: string | null
          status: string
          valor_total: number
        }
        Insert: {
          categoria_id?: number | null
          credor_id?: number | null
          criado_em?: string
          descricao: string
          dt_emissao?: string | null
          dt_vencimento?: string | null
          filial_id: number
          id?: number
          observacoes?: string | null
          status?: string
          valor_total: number
        }
        Update: {
          categoria_id?: number | null
          credor_id?: number | null
          criado_em?: string
          descricao?: string
          dt_emissao?: string | null
          dt_vencimento?: string | null
          filial_id?: number
          id?: number
          observacoes?: string | null
          status?: string
          valor_total?: number
        }
        Relationships: []
      }
      entidade_marca: {
        Row: {
          criado_em: string
          entidade_id: number
          id: number
          marca_id: number
        }
        Insert: {
          criado_em?: string
          entidade_id: number
          id?: number
          marca_id: number
        }
        Update: {
          criado_em?: string
          entidade_id?: number
          id?: number
          marca_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "entidade_marca_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "entidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entidade_marca_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "vw_dim_entidade"
            referencedColumns: ["entidade_id"]
          },
          {
            foreignKeyName: "entidade_marca_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "vw_empresas_unificadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entidade_marca_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "vw_pessoas_unificadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entidade_marca_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "vw_vendedores_unificados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entidade_marca_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
        ]
      }
      entidade_papel: {
        Row: {
          atribuicao_em: string
          entidade_id: number
          papel: Database["public"]["Enums"]["tipo_papel"]
        }
        Insert: {
          atribuicao_em?: string
          entidade_id: number
          papel: Database["public"]["Enums"]["tipo_papel"]
        }
        Update: {
          atribuicao_em?: string
          entidade_id?: number
          papel?: Database["public"]["Enums"]["tipo_papel"]
        }
        Relationships: [
          {
            foreignKeyName: "entidade_papel_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "entidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entidade_papel_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "vw_dim_entidade"
            referencedColumns: ["entidade_id"]
          },
          {
            foreignKeyName: "entidade_papel_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "vw_empresas_unificadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entidade_papel_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "vw_pessoas_unificadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entidade_papel_entidade_id_fkey"
            columns: ["entidade_id"]
            isOneToOne: false
            referencedRelation: "vw_vendedores_unificados"
            referencedColumns: ["id"]
          },
        ]
      }
      entidades: {
        Row: {
          ativo: boolean
          atualizado_em: string
          criado_em: string
          documento: string | null
          documento_norm: string | null
          email: string | null
          id: number
          metadados: Json | null
          nome: string
          telefone: string | null
          tipo_pessoa: string
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          documento?: string | null
          documento_norm?: string | null
          email?: string | null
          id?: number
          metadados?: Json | null
          nome: string
          telefone?: string | null
          tipo_pessoa: string
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          documento?: string | null
          documento_norm?: string | null
          email?: string | null
          id?: number
          metadados?: Json | null
          nome?: string
          telefone?: string | null
          tipo_pessoa?: string
        }
        Relationships: []
      }
      marcas: {
        Row: {
          ativo: boolean
          atualizado_em: string
          criado_em: string
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      metas_mensais: {
        Row: {
          ano: number
          criado_em: string
          entidade_id: number
          id: number
          mes: number
          valor_meta: number
        }
        Insert: {
          ano: number
          criado_em?: string
          entidade_id: number
          id?: number
          mes: number
          valor_meta: number
        }
        Update: {
          ano?: number
          criado_em?: string
          entidade_id?: number
          id?: number
          mes?: number
          valor_meta?: number
        }
        Relationships: []
      }
      nfe_data: {
        Row: {
          chave_acesso: string
          cnpj_destinatario: string | null
          cnpj_emitente: string | null
          data_emissao: string | null
          destinatario: string | null
          emitente: string | null
          modelo: string | null
          numero: string | null
          serie: string | null
          valor_total: number | null
          valores: Json | null
        }
        Insert: {
          chave_acesso: string
          cnpj_destinatario?: string | null
          cnpj_emitente?: string | null
          data_emissao?: string | null
          destinatario?: string | null
          emitente?: string | null
          modelo?: string | null
          numero?: string | null
          serie?: string | null
          valor_total?: number | null
          valores?: Json | null
        }
        Update: {
          chave_acesso?: string
          cnpj_destinatario?: string | null
          cnpj_emitente?: string | null
          data_emissao?: string | null
          destinatario?: string | null
          emitente?: string | null
          modelo?: string | null
          numero?: string | null
          serie?: string | null
          valor_total?: number | null
          valores?: Json | null
        }
        Relationships: []
      }
      nfe_duplicatas: {
        Row: {
          chave_acesso: string
          criado_em: string
          data_venc: string
          id: number
          num_dup: string | null
          pago_em: string | null
          status_target: string
          valor: number
        }
        Insert: {
          chave_acesso: string
          criado_em?: string
          data_venc: string
          id?: number
          num_dup?: string | null
          pago_em?: string | null
          status_target?: string
          valor: number
        }
        Update: {
          chave_acesso?: string
          criado_em?: string
          data_venc?: string
          id?: number
          num_dup?: string | null
          pago_em?: string | null
          status_target?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "nfe_duplicatas_chave_acesso_fkey"
            columns: ["chave_acesso"]
            isOneToOne: false
            referencedRelation: "nfe_data"
            referencedColumns: ["chave_acesso"]
          },
          {
            foreignKeyName: "nfe_duplicatas_chave_acesso_fkey"
            columns: ["chave_acesso"]
            isOneToOne: false
            referencedRelation: "vw_nfe_conciliada"
            referencedColumns: ["chave_acesso"]
          },
          {
            foreignKeyName: "nfe_duplicatas_chave_acesso_fkey"
            columns: ["chave_acesso"]
            isOneToOne: false
            referencedRelation: "vw_nfe_pendentes"
            referencedColumns: ["chave_acesso"]
          },
        ]
      }
      nfe_parcela_link: {
        Row: {
          chave_acesso: string
          criado_em: string
          id: number
          parcela_id: number
        }
        Insert: {
          chave_acesso: string
          criado_em?: string
          id?: number
          parcela_id: number
        }
        Update: {
          chave_acesso?: string
          criado_em?: string
          id?: number
          parcela_id?: number
        }
        Relationships: []
      }
      papeis: {
        Row: {
          nome: Database["public"]["Enums"]["tipo_papel"]
        }
        Insert: {
          nome: Database["public"]["Enums"]["tipo_papel"]
        }
        Update: {
          nome?: Database["public"]["Enums"]["tipo_papel"]
        }
        Relationships: []
      }
      parcelas_conta_pagar: {
        Row: {
          conta_pagar_id: number
          criado_em: string
          data_vencimento: string
          doc_pagto: string | null
          forma_pagto: string | null
          id: number
          num_parcela: number
          pago_em: string | null
          status: string
          valor_parcela: number
        }
        Insert: {
          conta_pagar_id: number
          criado_em?: string
          data_vencimento: string
          doc_pagto?: string | null
          forma_pagto?: string | null
          id?: number
          num_parcela?: number
          pago_em?: string | null
          status?: string
          valor_parcela: number
        }
        Update: {
          conta_pagar_id?: number
          criado_em?: string
          data_vencimento?: string
          doc_pagto?: string | null
          forma_pagto?: string | null
          id?: number
          num_parcela?: number
          pago_em?: string | null
          status?: string
          valor_parcela?: number
        }
        Relationships: [
          {
            foreignKeyName: "parcelas_conta_pagar_conta_pagar_id_fkey"
            columns: ["conta_pagar_id"]
            isOneToOne: false
            referencedRelation: "contas_pagar_corporativas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcelas_conta_pagar_conta_pagar_id_fkey"
            columns: ["conta_pagar_id"]
            isOneToOne: false
            referencedRelation: "vw_ap_aging"
            referencedColumns: ["conta_id"]
          },
        ]
      }
      recorrentes: {
        Row: {
          ativo: boolean
          categoria_id: number | null
          credor_id: number | null
          criado_em: string
          descricao: string
          dia_vencimento: number
          filial_id: number | null
          id: number
          valor: number
        }
        Insert: {
          ativo?: boolean
          categoria_id?: number | null
          credor_id?: number | null
          criado_em?: string
          descricao: string
          dia_vencimento: number
          filial_id?: number | null
          id?: number
          valor: number
        }
        Update: {
          ativo?: boolean
          categoria_id?: number | null
          credor_id?: number | null
          criado_em?: string
          descricao?: string
          dia_vencimento?: number
          filial_id?: number | null
          id?: number
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "recorrentes_credor_id_fkey"
            columns: ["credor_id"]
            isOneToOne: false
            referencedRelation: "entidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recorrentes_credor_id_fkey"
            columns: ["credor_id"]
            isOneToOne: false
            referencedRelation: "vw_dim_entidade"
            referencedColumns: ["entidade_id"]
          },
          {
            foreignKeyName: "recorrentes_credor_id_fkey"
            columns: ["credor_id"]
            isOneToOne: false
            referencedRelation: "vw_empresas_unificadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recorrentes_credor_id_fkey"
            columns: ["credor_id"]
            isOneToOne: false
            referencedRelation: "vw_pessoas_unificadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recorrentes_credor_id_fkey"
            columns: ["credor_id"]
            isOneToOne: false
            referencedRelation: "vw_vendedores_unificados"
            referencedColumns: ["id"]
          },
        ]
      }
      recorrentes_log: {
        Row: {
          ano: number
          executado_em: string
          id: number
          mes: number
          total_gerado: number
        }
        Insert: {
          ano: number
          executado_em?: string
          id?: number
          mes: number
          total_gerado: number
        }
        Update: {
          ano?: number
          executado_em?: string
          id?: number
          mes?: number
          total_gerado?: number
        }
        Relationships: []
      }
      vendas_mensais: {
        Row: {
          ano: number
          criado_em: string
          entidade_id: number
          id: number
          mes: number
          valor_vendido: number
        }
        Insert: {
          ano: number
          criado_em?: string
          entidade_id: number
          id?: number
          mes: number
          valor_vendido: number
        }
        Update: {
          ano?: number
          criado_em?: string
          entidade_id?: number
          id?: number
          mes?: number
          valor_vendido?: number
        }
        Relationships: []
      }
    }
    Views: {
      vw_ap_aging: {
        Row: {
          bucket_0_30: number | null
          bucket_31_60: number | null
          bucket_61_90: number | null
          bucket_90_plus: number | null
          conta_id: number | null
          credor_id: number | null
          descricao: string | null
          filial_id: number | null
          status: string | null
          total_em_aberto: number | null
        }
        Relationships: []
      }
      vw_ap_totais_mensais: {
        Row: {
          ano: number | null
          mes: number | null
          total: number | null
        }
        Relationships: []
      }
      vw_dim_entidade: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          documento: string | null
          email: string | null
          entidade_id: number | null
          is_cliente: boolean | null
          is_fornecedor: boolean | null
          is_funcionario: boolean | null
          nome: string | null
          telefone: string | null
          tipo_pessoa: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          documento?: string | null
          email?: string | null
          entidade_id?: number | null
          is_cliente?: never
          is_fornecedor?: never
          is_funcionario?: never
          nome?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          documento?: string | null
          email?: string | null
          entidade_id?: number | null
          is_cliente?: never
          is_fornecedor?: never
          is_funcionario?: never
          nome?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
        }
        Relationships: []
      }
      vw_empresas_unificadas: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          documento: string | null
          email: string | null
          id: number | null
          nome: string | null
          telefone: string | null
          tipo_pessoa: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          documento?: string | null
          email?: string | null
          id?: number | null
          nome?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          documento?: string | null
          email?: string | null
          id?: number | null
          nome?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
        }
        Relationships: []
      }
      vw_entidades_doc_invalidos: {
        Row: {
          documento: string | null
          documento_norm: string | null
          id: number | null
          nome: string | null
          status: string | null
          tipo_pessoa: string | null
        }
        Relationships: []
      }
      vw_metas_vendas_resumo: {
        Row: {
          ano: number | null
          atingimento_percentual: number | null
          entidade_id: number | null
          mes: number | null
          total_vendido: number | null
          valor_meta: number | null
        }
        Relationships: []
      }
      vw_nfe_conciliada: {
        Row: {
          chave_acesso: string | null
          data_emissao: string | null
          destinatario: string | null
          diferenca: number | null
          emitente: string | null
          numero: string | null
          qtd_parcelas: number | null
          serie: string | null
          total_nfe: number | null
          total_parcelas: number | null
        }
        Relationships: []
      }
      vw_nfe_pendentes: {
        Row: {
          chave_acesso: string | null
          data_emissao: string | null
          destinatario: string | null
          emitente: string | null
          modelo: string | null
          numero: string | null
          serie: string | null
          valor_total: number | null
          valores: Json | null
        }
        Insert: {
          chave_acesso?: string | null
          data_emissao?: string | null
          destinatario?: string | null
          emitente?: string | null
          modelo?: string | null
          numero?: string | null
          serie?: string | null
          valor_total?: number | null
          valores?: Json | null
        }
        Update: {
          chave_acesso?: string | null
          data_emissao?: string | null
          destinatario?: string | null
          emitente?: string | null
          modelo?: string | null
          numero?: string | null
          serie?: string | null
          valor_total?: number | null
          valores?: Json | null
        }
        Relationships: []
      }
      vw_pessoas_unificadas: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          documento: string | null
          email: string | null
          id: number | null
          nome: string | null
          telefone: string | null
          tipo_pessoa: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          documento?: string | null
          email?: string | null
          id?: number | null
          nome?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          documento?: string | null
          email?: string | null
          id?: number | null
          nome?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
        }
        Relationships: []
      }
      vw_vendedores_unificados: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          documento: string | null
          email: string | null
          id: number | null
          nome: string | null
          telefone: string | null
          tipo_pessoa: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          documento?: string | null
          email?: string | null
          id?: number | null
          nome?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          documento?: string | null
          email?: string | null
          id?: number | null
          nome?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      attach_marca: {
        Args: { p_entidade_id: number; p_marca: string }
        Returns: undefined
      }
      can_access_filial: {
        Args: { p_filial_id: number }
        Returns: boolean
      }
      cnpj_is_valid: {
        Args: { p_doc: string }
        Returns: boolean
      }
      cpf_is_valid: {
        Args: { p_doc: string }
        Returns: boolean
      }
      ensure_entidade_auto: {
        Args: {
          p_cnpj: string
          p_nome: string
          p_papel?: string
          p_tipo?: string
        }
        Returns: number
      }
      ensure_entidade_by_cnpj: {
        Args: {
          p_cnpj: string
          p_nome: string
          p_papel?: string
          p_tipo?: string
        }
        Returns: number
      }
      ensure_papel: {
        Args: { p_entidade_id: number; p_papel: string } | { p_papel: string }
        Returns: number
      }
      fn_conciliar_nfe: {
        Args: { p_chave: string; p_conta_id: number; p_criar_conta?: boolean }
        Returns: {
          conta_id: number
          msg: string
          ok: boolean
        }[]
      }
      fn_desfazer_conciliacao_nfe: {
        Args: { p_chave: string }
        Returns: number
      }
      fn_merge_entidades: {
        Args: { p_keep_id: number; p_merge_id: number }
        Returns: string
      }
      fn_nfe_parse_chave_safe: {
        Args: { p_chave: string }
        Returns: {
          aamm: string
          cdv: string
          cnf: string
          cnpj: string
          cuf: string
          modelo: string
          numero: string
          serie: string
          tpemis: string
        }[]
      }
      fn_nfe_pendentes: {
        Args: Record<PropertyKey, never>
        Returns: {
          chave_acesso: string
          cnpj_destinatario: string | null
          cnpj_emitente: string | null
          data_emissao: string | null
          destinatario: string | null
          emitente: string | null
          modelo: string | null
          numero: string | null
          serie: string | null
          valor_total: number | null
          valores: Json | null
        }[]
      }
      gerar_recorrentes: {
        Args: { pano: number; pmes: number }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      normalize_name: {
        Args: { p_text: string }
        Returns: string
      }
      only_digits: {
        Args: { p_text: string }
        Returns: string
      }
    }
    Enums: {
      tipo_papel:
        | "FORNECEDOR"
        | "CLIENTE"
        | "FUNCIONARIO"
        | "FORNECEDOR_REVENDA"
        | "FORNECEDOR_CONSUMO"
        | "PROPRIETARIO"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      tipo_papel: [
        "FORNECEDOR",
        "CLIENTE",
        "FUNCIONARIO",
        "FORNECEDOR_REVENDA",
        "FORNECEDOR_CONSUMO",
        "PROPRIETARIO",
      ],
    },
  },
} as const
