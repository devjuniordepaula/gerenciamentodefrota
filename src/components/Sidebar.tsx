"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X, LayoutDashboard, Truck, Building2, Receipt, 
  Wrench, Users2, LogOut, ChevronLeft, ChevronRight, 
  CarFront, Menu, Settings, AlertTriangle, ShieldCheck
} from "lucide-react";
import { cn } from "../../lib/utils";

type MenuItem = {
  label: string;
  href: string;
  icon: any;
};

type MenuGroup = {
  titulo: string;
  items: MenuItem[];
};

// --- ESTRUTURA DE NAVEGAÇÃO ESPELHADA DA IMAGEM ---
const menuGroups: MenuGroup[] = [
  {
    titulo: "GERAL",
    items: [{ href: '/painel', label: 'Visão Geral & Saldo', icon: LayoutDashboard }]
  },
  {
    titulo: "ADMINISTRAÇÃO",
    items: [
      { href: '/setores', label: 'Setores & Custos', icon: Building2 },
      { href: '/usuarios', label: 'Usuários & Permissões', icon: Users2 },
    ]
  },
  {
    titulo: "OPERACIONAL",
    items: [
      { href: '/veiculos', label: 'Frota de Veículos', icon: Truck },
      { href: '/veiculos/regularizacao', label: 'Regularização', icon: ShieldCheck }, // <-- Nova Rota
      { href: '/veiculos/multas', label: 'Gestão de Multas', icon: AlertTriangle }, // <-- Nova Rota
      { href: '/planos', label: 'Planos de Manutenção', icon: Wrench },
    ]
  },
  {
    titulo: "FINANCEIRO",
    items: [
      { href: '/despesas', label: 'Gastos & Despesas', icon: Receipt },
    ]
  },
  {
    titulo: "CONFIGURAÇÕES",
    items: [
      { href: '/configuracoes', label: 'Configuração', icon: Settings },
    ]
  }
];

export function Sidebar({ 
  onLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen 
}: { 
  onLogout?: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Mock de perfil para visualização
  const profile = {
    nome: "Júnior de Paula",
    perfil: "Administrador",
    avatar_url: "https://github.com/shadcn.png" 
  };

  return (
    <>
      {/* OVERLAY ESCURO NO CELULAR */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen?.(false)}
        />
      )}

      <aside
        className={cn(
          "flex flex-col transition-all duration-300 shrink-0",
          // Cor de fundo cravada no design da imagem (Azul/Slate profundo)
          "bg-[#0b1120] text-slate-300 border-r border-[#1e293b]",
          "fixed inset-y-0 left-0 z-50 h-[100dvh] transform",
          isMobileMenuOpen ? "translate-x-0 w-[260px]" : "-translate-x-full w-[260px]",
          "md:relative md:translate-x-0 md:h-screen",
          collapsed ? "md:w-[72px]" : "md:w-[260px]"
        )}
      >
        {/* BOTÃO DE COLLAPSE (Igual ao da imagem: círculo azul flutuante) */}
        <button
          onClick={() => setIsMobileMenuOpen ? setIsMobileMenuOpen(false) : setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-500 transition-colors z-30"
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isMobileMenuOpen ? <X size={14} /> : (collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />)}
        </button>

        {/* HEADER / LOGO */}
        <div className={cn("flex items-center h-20 px-4 border-b border-[#1e293b]/80 shrink-0", collapsed ? "justify-center" : "justify-start")}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-blue-600 p-1.5 rounded-lg shrink-0">
              <CarFront className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                Frota<span className="text-blue-500">PRO</span>
              </h1>
            )}
          </div>
        </div>
        
        {/* NAVEGAÇÃO PRINCIPAL */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 pt-6 pb-2">
          {menuGroups.map((grupo, index) => {
            return (
              <div key={grupo.titulo} className="mb-6">
                
                {/* TÍTULO DO GRUPO */}
                {!collapsed || isMobileMenuOpen ? (
                  <h4 className="px-3 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    {grupo.titulo}
                  </h4>
                ) : (
                  index !== 0 && <div className="h-px bg-slate-800 w-8 mx-auto mb-4 mt-2" />
                )}

                <div className="space-y-1">
                  {grupo.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href; 
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen?.(false)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative overflow-hidden group",
                          isActive
                            ? "bg-blue-900/30 text-blue-500 font-semibold"
                            : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 font-medium",
                          collapsed && !isMobileMenuOpen && "justify-center px-0"
                        )}
                        title={collapsed && !isMobileMenuOpen ? item.label : undefined}
                      >
                        {/* MARCADOR VERTICAL AZUL (Active State da Imagem) */}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md" />
                        )}

                        <div className="relative flex items-center justify-center shrink-0">
                          <Icon
                            className={cn(
                              "h-[18px] w-[18px] transition-colors",
                              isActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-200"
                            )}
                          />
                        </div>
                        
                        {(!collapsed || isMobileMenuOpen) && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
        
        {/* FOOTER: PERFIL DO USUÁRIO & LOGOUT */}
        <div className="p-4 border-t border-[#1e293b] bg-[#070b14] flex items-center justify-between shrink-0">
          
          <div className={cn("flex items-center gap-3 min-w-0 flex-1", collapsed && !isMobileMenuOpen && "hidden")}>
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 overflow-hidden">
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="object-cover h-full w-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-200 truncate">{profile.nome}</p>
              <p className="text-[11px] font-medium text-slate-500 truncate">{profile.perfil}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className={cn(
              "p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors shrink-0",
              collapsed && !isMobileMenuOpen && "mx-auto w-full flex justify-center py-2"
            )}
            title="Sair do sistema"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>
    </>
  );
}