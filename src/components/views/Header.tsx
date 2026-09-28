import React from 'react';
import { useFleet } from '../context/FleetContext';
import { RotateCcw, ShieldCheck, ChevronDown } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { currentUser, users, setCurrentUserId, metrics, activeTab, resetToDefaults } = useFleet();

  const getTabLabel = (tab: string): string => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard de Saldo & Manutenção';
      case 'sectors':
        return 'Cadastro de Setores & Centros de Custo';
      case 'users':
        return 'Usuários & Matriz de Permissões';
      case 'vehicles':
        return 'Frota de Veículos';
      case 'plans':
        return 'Planos de Manutenção Preventiva';
      case 'warranties':
        return 'Controle de Garantias de Peças & Serviços';
      case 'expenses':
        return 'Lançamentos de Gastos (OSs)';
      case 'price_comparison':
        return 'Comparativo de Preços entre Peças';
      case 'financial_calendar':
        return 'Controle Financeiro & Calendário Anual';
      case 'accredited':
        return 'Rede de Credenciados & Mapa de Atendimento';
      case 'reports':
        return 'Relatórios Mensais & Exportações';
      default:
        return 'Visão Geral';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shrink-0">
      {/* Zone 1: Breadcrumbs & Current View */}
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-600">
          FrotaMaster SaaS
        </span>
        <span className="text-slate-300">/</span>
        <h1 className="text-sm font-semibold text-slate-800">
          {getTabLabel(activeTab)}
        </h1>
      </div>

      {/* Zone 2: Budget Quick Snapshot (Unboxed clean metadata) */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono tabular-nums">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-700">Orçamento Mês:</span>
          <span className="font-semibold text-slate-800">{formatCurrency(metrics.totalMonthlyBudget)}</span>
        </div>
        <span className="text-slate-300">·</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-700">Consumido:</span>
          <span className="font-semibold text-amber-800">{formatCurrency(metrics.totalSpentCurrentMonth)}</span>
          <span className="text-slate-700">({metrics.monthlyConsumptionPercentage.toFixed(1)}%)</span>
        </div>
        <span className="text-slate-300">·</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-700">Disponível:</span>
          <span className={`font-semibold ${metrics.remainingMonthlyBudget >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
            {formatCurrency(metrics.remainingMonthlyBudget)}
          </span>
        </div>
      </div>

      {/* Zone 3: Actions & Active Profile Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={resetToDefaults}
          title="Restaurar dados de teste"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restaurar Dados</span>
        </button>

        {/* User Role Switcher Dropdown */}
        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
          <div className="flex items-center gap-2 mr-2">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px]">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-medium text-slate-800 truncate max-w-[120px]">{currentUser.name}</div>
              <div className="text-[10px] text-slate-700 flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5 text-slate-600" />
                <span>{currentUser.roleTitle}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <select
              aria-label="Perfil de Usuário Ativo"
              value={currentUser.id}
              onChange={(e) => setCurrentUserId(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer pr-1"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.roleTitle.split(' ')[0]})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none -ml-1" />
          </div>
        </div>
      </div>
    </header>
  );
};
