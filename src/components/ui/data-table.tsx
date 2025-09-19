import React, { useState, useMemo } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./table";
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Settings2, Search, X } from "lucide-react";

export type DataTableColumn<T> = {
  key: keyof T | string;
  title: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
};

export type DataTableFilter = {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'boolean';
  options?: { value: string; label: string }[];
  value: any;
};

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  filters?: DataTableFilter[];
  onFiltersChange?: (filters: DataTableFilter[]) => void;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns: allColumns,
  loading = false,
  searchable = true,
  searchPlaceholder = "Buscar...",
  filters = [],
  onFiltersChange,
  actions,
  emptyMessage = "Nenhum registro encontrado",
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(allColumns.map(col => col.key as string))
  );
  const [activeFilters, setActiveFilters] = useState<DataTableFilter[]>(filters);

  // Filtered columns based on visibility
  const columns = allColumns.filter(col => visibleColumns.has(col.key as string));

  // Apply search and filters
  const filteredData = useMemo(() => {
    let result = data;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value || "").toLowerCase().includes(query)
        )
      );
    }

    // Apply filters
    activeFilters.forEach(filter => {
      if (!filter.value) return;
      
      result = result.filter(item => {
        const itemValue = item[filter.key];
        
        switch (filter.type) {
          case 'text':
            return String(itemValue || "").toLowerCase().includes(
              String(filter.value).toLowerCase()
            );
          case 'select':
            return itemValue === filter.value;
          case 'boolean':
            return Boolean(itemValue) === Boolean(filter.value);
          default:
            return true;
        }
      });
    });

    return result;
  }, [data, searchQuery, activeFilters]);

  const updateFilter = (key: string, value: any) => {
    const newFilters = activeFilters.map(filter =>
      filter.key === key ? { ...filter, value } : filter
    );
    setActiveFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilter = (key: string) => {
    updateFilter(key, null);
  };

  const activeFilterCount = activeFilters.filter(f => f.value).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Column Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </div>

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              Colunas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {allColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key as string}
                className="capitalize"
                checked={visibleColumns.has(column.key as string)}
                onCheckedChange={(checked) => {
                  const newVisible = new Set(visibleColumns);
                  if (checked) {
                    newVisible.add(column.key as string);
                  } else {
                    newVisible.delete(column.key as string);
                  }
                  setVisibleColumns(newVisible);
                }}
              >
                {column.title}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {activeFilters
            .filter(f => f.value)
            .map(filter => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="gap-1"
              >
                {filter.label}: {String(filter.value)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => clearFilter(filter.key)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
        </div>
      )}

      {/* Filters Row */}
      {filters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/20">
          {filters.map(filter => (
            <div key={filter.key} className="space-y-2">
              <label className="text-sm font-medium">{filter.label}</label>
              {filter.type === 'text' && (
                <Input
                  placeholder={`Filtrar por ${filter.label.toLowerCase()}`}
                  value={filter.value || ""}
                  onChange={(e) => updateFilter(filter.key, e.target.value)}
                />
              )}
              {filter.type === 'select' && filter.options && (
                <select
                  className="w-full px-3 py-2 border border-input rounded-md"
                  value={filter.value || ""}
                  onChange={(e) => updateFilter(filter.key, e.target.value)}
                >
                  <option value="">Todos</option>
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key as string}
                  style={{ width: column.width }}
                  className={
                    column.align === 'center' ? 'text-center' :
                    column.align === 'right' ? 'text-right' : ''
                  }
                >
                  {column.title}
                </TableHead>
              ))}
              {actions && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (actions ? 1 : 0)} 
                  className="text-center text-muted-foreground py-8"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key as string}
                      className={
                        column.align === 'center' ? 'text-center' :
                        column.align === 'right' ? 'text-right' : ''
                      }
                    >
                      {column.render 
                        ? column.render(item)
                        : String(item[column.key] || "-")
                      }
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right">
                      {actions(item)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredData.length} de {data.length} registros
        {searchQuery && ` para "${searchQuery}"`}
      </div>
    </div>
  );
}