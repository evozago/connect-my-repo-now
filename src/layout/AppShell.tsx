import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { Button } from "../components/ui/button";
import { LogOut, BarChart3 } from "lucide-react";

/**
 * AppShell: Sidebar + Header + Conteúdo
 * - Mostra o email do usuário logado e botão "Sair"
 * - Menu lateral com TODOS os módulos (links prontos)
 * - Realça a rota ativa
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user?.email ?? null));
    return () => sub.subscription?.unsubscribe();
  }, []);

  async function sair() {
    await supabase.auth.signOut();
    nav("/login", { replace: true });
  }

  const items = useMemo(
    () => [
      { section: "Cadastros", links: [
        { to: "/entidades", label: "Entidades" },
      ]},
      { section: "Financeiro • AP", links: [
        { to: "/financeiro/contas", label: "Contas" },
        { to: "/financeiro/contas/nova", label: "Nova Conta" },
        { to: "/financeiro/demo", label: "Demo Avançado" },
      ]},
      { section: "Financeiro • Recorrentes", links: [
        { to: "/recorrentes", label: "Lista" },
        { to: "/recorrentes/nova", label: "Novo recorrente" },
        { to: "/recorrentes/log", label: "Log de geração" },
      ]},
      { section: "NFe", links: [
        { to: "/nfe/importar", label: "Importar XML" },
        { to: "/nfe/conciliar", label: "Conciliar" },
      ]},
      { section: "Vendas/Metas (em breve)", links: [
        { to: "/metas", label: "Metas" },
        { to: "/vendas", label: "Lançamentos" },
      ]},
      { section: "Dashboards (em breve)", links: [
        { to: "/dashboards", label: "Painel" },
      ]},
    ],
    []
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">FinanceiroLB</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-6">
            {items.map((blk) => (
              <div key={blk.section}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {blk.section}
                </h3>
                <div className="space-y-1">
                  {blk.links.map((l) => {
                    const isActive = loc.pathname === l.to || (l.to !== "/" && loc.pathname.startsWith(l.to));
                    return (
                      <Link
                        key={l.to}
                        to={l.to}
                        className={`
                          block px-3 py-2 text-sm rounded-md transition-colors
                          ${isActive 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          }
                        `}
                      >
                        {l.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            {email && (
              <div className="text-xs text-muted-foreground mb-3 break-all">
                {email}
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={sair}
              className="w-full gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between h-full px-6">
            <div></div>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleString("pt-BR")}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

