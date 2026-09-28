import React from 'react';
import { useFleet } from '../../app/context/FleetContext';
import {
  LayoutDashboard,
  Building2,
  Users2,
  Truck,
  Wrench,
  ShieldAlert,
  Receipt,
  Scale,
  CalendarRange,
  MapPin,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useFleet();
  const perms = currentUser.permissions;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Visão Geral & Saldo',
      icon: LayoutDashboard,
      allowed: true,
      category: 'Geral',
    },
    {
      id: 'sectors',
      label: 'Setores & Custos',
      icon: Building2,
      allowed: perms.canManageSectors || currentUser.role === 'admin',
      category: 'Administração',
    },
    {
      id: 'users',
      label: 'Usuários & Permissões',
      icon: Users2,
      allowed: perms.canManageUsers || currentUser.role === 'admin',
      category: 'Administração',
    },
    {
      id: 'vehicles',
      label: 'Frota de Veículos',
      icon: Truck,
      allowed: true, // Visible to all, but actions restricted by perms
      category: 'Operacional',
    },
    {
      id: 'plans',
      label: 'Planos de Manutenção',
      icon: Wrench,
      allowed: true,
      category: 'Operacional',
    },
    {
      id: 'warranties',
      label: 'Garantias',
      icon: ShieldAlert,
      allowed: true,
      category: 'Operacional',
    },
    {
      id: 'expenses',
      label: 'Gastos com Peças/Serv.',
      icon: Receipt,
      allowed: perms.canManageExpenses || perms.canViewFinancials || currentUser.role === 'admin',
      category: 'Financeiro',
    },
    {
      id: 'price_comparison',
      label: 'Comparativo de Peças',
      icon: Scale,
      allowed: true,
      category: 'Financeiro',
    },
    {
      id: 'financial_calendar',
      label: 'Calendário Financeiro',
      icon: CalendarRange,
      allowed: perms.canViewFinancials || currentUser.role === 'admin',
      category: 'Financeiro',
    },
    {
      id: 'accredited',
      label: 'Rede Credenciada & NPS',
      icon: MapPin,
      allowed: true,
      category: 'Rede',
    },
    {
      id: 'reports',
      label: 'Relatórios Exportáveis',
      icon: FileSpreadsheet,
      allowed: perms.canExportReports || currentUser.role === 'admin',
      category: 'Rede',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 select-none border-r border-slate-800">
      {/* Brand Title Area */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm tracking-tighter">
          FM
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-base tracking-tight leading-none">
            FrotaMaster
          </span>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">
            SaaS Gestão de Frota
          </span>
        </div>
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAllowed = item.allowed;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isAllowed) {
                  setActiveTab(item.id);
                }
              }}
              disabled={!isAllowed}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors text-left ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : isAllowed
                  ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  : 'text-slate-600 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-slate-950' : isAllowed ? 'text-slate-400' : 'text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {!isAllowed && (
                <Lock className="w-3 h-3 text-slate-600 shrink-0 ml-1" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Current User Role Notice */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400">
        <div className="flex items-center justify-between text-slate-300 font-medium">
          <span className="truncate">{currentUser.name.split(' ')[0]}</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            {currentUser.role.replace('_', ' ')}
          </span>
        </div>
        <div className="mt-1 text-[10px] text-slate-500 leading-tight">
          Permissões ativas em tempo real
        </div>
      </div>
    </aside>
  );
};
