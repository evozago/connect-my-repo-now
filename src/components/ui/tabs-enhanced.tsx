import React, { useState, createContext, useContext } from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import { X, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: string | number;
  closable?: boolean;
  disabled?: boolean;
}

interface TabsContext {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  tabs: TabItem[];
  setTabs: React.Dispatch<React.SetStateAction<TabItem[]>>;
}

const TabsContext = createContext<TabsContext | null>(null);

interface TabsEnhancedProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
}

export function TabsEnhanced({
  children,
  defaultValue,
  value,
  onValueChange,
  className,
  orientation = 'horizontal',
  variant = 'default',
}: TabsEnhancedProps) {
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue || '');

  const activeTab = value || internalActiveTab;
  const setActiveTab = (tabId: string) => {
    if (onValueChange) {
      onValueChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, tabs, setTabs }}>
      <div 
        className={cn(
          "tabs-enhanced",
          orientation === 'vertical' && "flex gap-4",
          className
        )}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children?: React.ReactNode;
  className?: string;
  showAddButton?: boolean;
  onAddTab?: () => void;
  addButtonLabel?: string;
}

export function TabsList({
  children,
  className,
  showAddButton,
  onAddTab,
  addButtonLabel = "Nova Aba",
}: TabsListProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsList must be used within TabsEnhanced");

  const { tabs, activeTab, setActiveTab, setTabs } = context;

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      
      // If the closed tab was active, switch to another tab
      if (activeTab === tabId && newTabs.length > 0) {
        const closedIndex = prev.findIndex(tab => tab.id === tabId);
        const nextTab = newTabs[Math.min(closedIndex, newTabs.length - 1)];
        setActiveTab(nextTab.id);
      }
      
      return newTabs;
    });
  };

  return (
    <div className={cn("flex items-center gap-1 border-b bg-muted/20 p-1", className)}>
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            disabled={tab.disabled}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "gap-2 whitespace-nowrap",
              activeTab === tab.id && "bg-background shadow-sm"
            )}
          >
            {tab.label}
            {tab.badge && (
              <Badge variant="secondary" className="h-5 min-w-5 text-xs">
                {tab.badge}
              </Badge>
            )}
            {tab.closable && (
              <X
                className="h-3 w-3 ml-1 hover:bg-muted-foreground/20 rounded"
                onClick={(e) => closeTab(tab.id, e)}
              />
            )}
          </Button>
        ))}
      </div>
      
      {showAddButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddTab}
          className="gap-1 shrink-0"
        >
          <Plus className="h-3 w-3" />
          {addButtonLabel}
        </Button>
      )}
      
      {children}
    </div>
  );
}

interface TabsContentProps {
  children?: React.ReactNode;
  className?: string;
}

export function TabsContent({ children, className }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within TabsEnhanced");

  const { tabs, activeTab } = context;
  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={cn("flex-1 p-4", className)}>
      {currentTab?.content || children}
    </div>
  );
}

// Hook to manage tabs dynamically
export function useTabsEnhanced(initialTabs: TabItem[] = []) {
  const [tabs, setTabs] = useState<TabItem[]>(initialTabs);
  const [activeTab, setActiveTab] = useState(initialTabs[0]?.id || '');

  const addTab = (tab: TabItem) => {
    setTabs(prev => {
      // Check if tab already exists
      if (prev.find(t => t.id === tab.id)) {
        setActiveTab(tab.id);
        return prev;
      }
      
      const newTabs = [...prev, tab];
      setActiveTab(tab.id);
      return newTabs;
    });
  };

  const removeTab = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      
      if (activeTab === tabId && newTabs.length > 0) {
        const closedIndex = prev.findIndex(tab => tab.id === tabId);
        const nextTab = newTabs[Math.min(closedIndex, newTabs.length - 1)];
        setActiveTab(nextTab.id);
      }
      
      return newTabs;
    });
  };

  const updateTab = (tabId: string, updates: Partial<TabItem>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  };

  return {
    tabs,
    activeTab,
    setActiveTab,
    addTab,
    removeTab,
    updateTab,
    setTabs,
  };
}