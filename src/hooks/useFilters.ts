import { useState, useMemo } from "react";

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'boolean' | 'number' | 'daterange';
  options?: { value: string; label: string }[];
  defaultValue?: any;
}

export interface FilterValue {
  key: string;
  value: any;
}

export function useFilters<T extends Record<string, any>>(
  data: T[],
  filterConfigs: FilterConfig[]
) {
  const [filters, setFilters] = useState<FilterValue[]>(
    filterConfigs.map(config => ({
      key: config.key,
      value: config.defaultValue || null,
    }))
  );

  const [searchQuery, setSearchQuery] = useState("");

  // Apply filters to data
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

    // Apply individual filters
    filters.forEach(filter => {
      const config = filterConfigs.find(c => c.key === filter.key);
      if (!config || !filter.value) return;

      result = result.filter(item => {
        const itemValue = item[filter.key];

        switch (config.type) {
          case 'text':
            return String(itemValue || "").toLowerCase().includes(
              String(filter.value).toLowerCase()
            );
          
          case 'select':
            return itemValue === filter.value;
          
          case 'boolean':
            return Boolean(itemValue) === Boolean(filter.value);
          
          case 'number':
            return Number(itemValue) === Number(filter.value);
          
          case 'date':
            if (!itemValue) return false;
            const itemDate = new Date(itemValue).toDateString();
            const filterDate = new Date(filter.value).toDateString();
            return itemDate === filterDate;
          
          case 'daterange':
            if (!itemValue || !filter.value.start || !filter.value.end) return true;
            const itemDateValue = new Date(itemValue);
            const startDate = new Date(filter.value.start);
            const endDate = new Date(filter.value.end);
            return itemDateValue >= startDate && itemDateValue <= endDate;
          
          default:
            return true;
        }
      });
    });

    return result;
  }, [data, filters, searchQuery, filterConfigs]);

  // Update a specific filter
  const updateFilter = (key: string, value: any) => {
    setFilters(prev =>
      prev.map(filter =>
        filter.key === key ? { ...filter, value } : filter
      )
    );
  };

  // Clear a specific filter
  const clearFilter = (key: string) => {
    updateFilter(key, null);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters(prev =>
      prev.map(filter => ({ ...filter, value: null }))
    );
    setSearchQuery("");
  };

  // Get active filters count
  const activeFiltersCount = filters.filter(f => f.value !== null && f.value !== "").length;

  // Get filter value by key
  const getFilterValue = (key: string) => {
    return filters.find(f => f.key === key)?.value;
  };

  // Check if a filter is active
  const isFilterActive = (key: string) => {
    const value = getFilterValue(key);
    return value !== null && value !== "";
  };

  // Get filter config by key
  const getFilterConfig = (key: string) => {
    return filterConfigs.find(c => c.key === key);
  };

  return {
    filteredData,
    filters,
    searchQuery,
    setSearchQuery,
    updateFilter,
    clearFilter,
    clearAllFilters,
    activeFiltersCount,
    getFilterValue,
    isFilterActive,
    getFilterConfig,
  };
}