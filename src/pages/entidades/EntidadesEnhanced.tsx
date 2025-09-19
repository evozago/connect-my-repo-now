import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { DataTable, DataTableColumn, DataTableFilter } from "../../components/ui/data-table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { TabsEnhanced, TabsList, TabsContent, useTabsEnhanced } from "../../components/ui/tabs-enhanced";
import { useFilters } from "../../hooks/useFilters";
import { Edit, Trash2, Plus, Users, Building, UserCheck } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

type Entidade = {
  id: number;
  nome: string;
  tipo_pessoa: "FISICA" | "JURIDICA";
  documento: string | null;
  ativo: boolean;
  criado_em: string;
  email?: string;
  telefone?: string;
};

export default function EntidadesEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Entidade[]>([]);

  // Filter configuration
  const filterConfigs = [
    {
      key: 'nome',
      label: 'Nome',
      type: 'text' as const,
    },
    {
      key: 'tipo_pessoa',
      label: 'Tipo',
      type: 'select' as const,
      options: [
        { value: 'FISICA', label: 'Pessoa Física' },
        { value: 'JURIDICA', label: 'Pessoa Jurídica' },
      ],
    },
    {
      key: 'ativo',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'true', label: 'Ativo' },
        { value: 'false', label: 'Inativo' },
      ],
    },
  ];

  const {
    filteredData,
    searchQuery,
    setSearchQuery,
    updateFilter,
    clearAllFilters,
    activeFiltersCount,
    getFilterValue,
  } = useFilters(data, filterConfigs);

  // Tab management
  const { tabs, activeTab, addTab, removeTab, setActiveTab } = useTabsEnhanced([
    {
      id: 'all',
      label: 'Todas',
      content: null,
      badge: data.length,
    }
  ]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Update tabs with current data counts
    const activasCount = data.filter(e => e.ativo).length;
    const inativasCount = data.filter(e => e.ativo === false).length;
    const fisicasCount = data.filter(e => e.tipo_pessoa === 'FISICA').length;
    const juridicasCount = data.filter(e => e.tipo_pessoa === 'JURIDICA').length;

    // Update existing tabs or add new ones
    const updatedTabs = [
      { id: 'all', label: 'Todas', content: null, badge: data.length },
      { id: 'ativas', label: 'Ativas', content: null, badge: activasCount },
      { id: 'inativas', label: 'Inativas', content: null, badge: inativasCount },
      { id: 'fisicas', label: 'Pessoas Físicas', content: null, badge: fisicasCount },
      { id: 'juridicas', label: 'Pessoas Jurídicas', content: null, badge: juridicasCount },
    ];

    updatedTabs.forEach(tab => addTab(tab));
  }, [data]);

  async function loadData() {
    setLoading(true);
    try {
      const { data: entidades, error } = await supabase
        .from("entidades")
        .select("*")
        .order("id", { ascending: false })
        .limit(500);

      if (error) throw error;
      setData(entidades || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta entidade?")) return;

    try {
      const { error } = await supabase
        .from("entidades")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setData(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Sucesso",
        description: "Entidade excluída com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  // Filter data based on active tab
  const getTabFilteredData = () => {
    let tabData = filteredData;
    
    switch (activeTab) {
      case 'ativas':
        tabData = filteredData.filter(e => e.ativo);
        break;
      case 'inativas':
        tabData = filteredData.filter(e => !e.ativo);
        break;
      case 'fisicas':
        tabData = filteredData.filter(e => e.tipo_pessoa === 'FISICA');
        break;
      case 'juridicas':
        tabData = filteredData.filter(e => e.tipo_pessoa === 'JURIDICA');
        break;
      default:
        tabData = filteredData;
    }
    
    return tabData;
  };

  // Table columns configuration
  const columns: DataTableColumn<Entidade>[] = [
    {
      key: 'id',
      title: 'ID',
      width: '80px',
      render: (item) => (
        <Badge variant="outline" className="font-mono">
          #{item.id}
        </Badge>
      ),
    },
    {
      key: 'nome',
      title: 'Nome',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.tipo_pessoa === 'FISICA' ? (
            <Users className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Building className="h-4 w-4 text-muted-foreground" />
          )}
          <div>
            <div className="font-medium">{item.nome}</div>
            {item.email && (
              <div className="text-sm text-muted-foreground">{item.email}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'tipo_pessoa',
      title: 'Tipo',
      width: '120px',
      render: (item) => (
        <Badge variant={item.tipo_pessoa === 'FISICA' ? 'default' : 'secondary'}>
          {item.tipo_pessoa === 'FISICA' ? 'Física' : 'Jurídica'}
        </Badge>
      ),
    },
    {
      key: 'documento',
      title: 'Documento',
      width: '150px',
      render: (item) => (
        <span className="font-mono text-sm">
          {item.documento || '-'}
        </span>
      ),
    },
    {
      key: 'ativo',
      title: 'Status',
      width: '100px',
      align: 'center',
      render: (item) => (
        <div className="flex items-center justify-center">
          <div className={`h-2 w-2 rounded-full ${
            item.ativo ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="ml-2 text-sm">
            {item.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      ),
    },
    {
      key: 'telefone',
      title: 'Telefone',
      width: '140px',
      render: (item) => (
        <span className="text-sm">
          {item.telefone || '-'}
        </span>
      ),
    },
    {
      key: 'criado_em',
      title: 'Criado em',
      width: '140px',
      render: (item) => (
        <span className="text-sm">
          {new Date(item.criado_em).toLocaleDateString('pt-BR')}
        </span>
      ),
    },
  ];

  const dataTableFilters: DataTableFilter[] = filterConfigs.map(config => ({
    key: config.key,
    label: config.label,
    type: config.type,
    options: config.options,
    value: getFilterValue(config.key),
  }));

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Entidades</h1>
          <p className="text-muted-foreground">
            Gerencie pessoas físicas e jurídicas do sistema
          </p>
        </div>
        <Button asChild>
          <Link to="/entidades/nova" className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Entidade
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter(e => e.ativo).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pessoas Físicas</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter(e => e.tipo_pessoa === 'FISICA').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pessoas Jurídicas</CardTitle>
            <Building className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter(e => e.tipo_pessoa === 'JURIDICA').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Card>
        <TabsEnhanced value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {/* Tabs are managed dynamically */}
          </TabsList>
          
          <TabsContent>
            <DataTable
              data={getTabFilteredData()}
              columns={columns}
              loading={loading}
              searchable={true}
              searchPlaceholder="Buscar entidades..."
              filters={dataTableFilters}
              onFiltersChange={(filters) => {
                filters.forEach(filter => {
                  updateFilter(filter.key, filter.value);
                });
              }}
              actions={(item) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/entidades/${item.id}`)}
                    className="gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    Excluir
                  </Button>
                </div>
              )}
              emptyMessage="Nenhuma entidade encontrada"
            />
          </TabsContent>
        </TabsEnhanced>
      </Card>
    </div>
  );
}