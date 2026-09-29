'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users2, Truck, Wrench, Receipt } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

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
        { id: '/planos-manutencao', label: 'Planos de Manutenção', icon: Wrench },
      ]
    },
    {
      title: "Financeiro",
      items: [
        { id: '/despesas', label: 'Gastos & Despesas', icon: Receipt },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">FM</div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-base leading-none">FrotaMaster</span>
          <span className="text-[10px] text-blue-400 font-mono mt-0.5">MicroSaaS</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{group.title}</h4>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.id || pathname.startsWith(`${item.id}/`);
              return (
                <Link key={item.id} href={item.id} className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded transition-colors ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};