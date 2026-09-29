'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Truck, Building2, Receipt, 
  Wrench, Users2, LogOut, ChevronLeft, ChevronRight, CarFront
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// --- ESTRUTURA DE NAVEGAÇÃO AGRUPADA ---
const navGroups = [
  {
    title: "Geral",
    items: [{ id: '/painel', label: 'Visão Geral & Saldo', icon: LayoutDashboard }]
  },
  {
    title: "Administração",
    items: [
      { id: '/setores', label: 'Setores & Custos', icon: Building2 },
      { id: '/usuarios', label: 'Usuários & Permissões', icon: Users2 },
    ]
  },
  {
    title: "Operacional",
    items: [
      { id: '/veiculos', label: 'Frota de Veículos', icon: Truck },
      { id: '/planos', label: 'Planos de Manutenção', icon: Wrench },
    ]
  },
  {
    title: "Financeiro",
    items: [
      { id: '/despesas', label: 'Gastos & Despesas', icon: Receipt },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`relative flex flex-col h-screen bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      } hidden md:flex`}
    >
      {/* BOTÃO DE COLLAPSE (Flutuante na borda) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors z-30 ring-2 ring-slate-900"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* HEADER / LOGO */}
      <div className={`flex items-center h-20 border-b border-slate-800/80 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
            <CarFront size={20} />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg text-white tracking-tight">
              Frota<span className="text-blue-500">PRO</span>
            </span>
          )}
        </div>
      </div>

      {/* NAVEGAÇÃO PRINCIPAL (Agrupada) */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-hide">
        {navGroups.map((group, index) => (
          <div key={index} className="flex flex-col">
            
            {/* Título do Grupo (Oculto se colapsado) */}
            {!isCollapsed ? (
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
                {group.title}
              </span>
            ) : (
              // Separador visual discreto quando colapsado (exceto no primeiro grupo)
              index > 0 && <div className="h-px w-8 bg-slate-800 mx-auto mb-2 mt-4" />
            )}

            {/* Links do Grupo */}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.id;
                const Icon = item.icon;

                return (
                  <Link key={item.id} href={item.id}>
                    <span
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group relative ${
                        isActive 
                          ? 'bg-blue-600/15 text-blue-400' 
                          : 'hover:bg-slate-800 hover:text-white'
                      } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {/* Marcador lateral luminoso quando ativo */}
                      {isActive && !isCollapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-md" />
                      )}

                      <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} />
                      
                      {!isCollapsed && (
                        <span className={`text-sm font-medium ${isActive ? 'text-blue-400' : 'text-slate-300 group-hover:text-white'}`}>
                          {item.label}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>

          </div>
        ))}
      </nav>

      {/* FOOTER: PERFIL DO USUÁRIO & LOGOUT */}
      <div className="border-t border-slate-800/80 p-4 bg-slate-900/50">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="h-9 w-9 border-2 border-slate-700 shadow-sm">
              <AvatarImage src="https://github.com/shadcn.png" alt="Gestor" />
              <AvatarFallback className="bg-slate-800 text-slate-300 font-medium">GS</AvatarFallback>
            </Avatar>
            
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-semibold text-slate-200 truncate">Júnior de Paula</span>
                <span className="text-[11px] font-medium text-slate-500 truncate">Administrador</span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 shrink-0 h-8 w-8 transition-colors">
              <LogOut size={18} />
            </Button>
          )}
        </div>

        {/* Botão de Logout centralizado quando colapsado */}
        {isCollapsed && (
          <div className="mt-4 flex justify-center">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 shrink-0 h-8 w-8 transition-colors">
              <LogOut size={18} />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}