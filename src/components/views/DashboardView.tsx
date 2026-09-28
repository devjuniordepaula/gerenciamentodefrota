import React from 'react';
import { useFleet } from '../context/FleetContext';
import { formatCurrency, formatKm, formatDate } from '../utils/formatters';
import {
  Wallet,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Wrench,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  PlusCircle,
  FileText,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    metrics,
    sectors,
    vehicles,
    expenses,
    warranties,
    maintenancePlans,
    setActiveTab,
    currentUser,
  } = useFleet();

  const vehiclesInMaintenance = vehicles.filter((v) => v.status === 'in_maintenance');
  const activeVehicles = vehicles.filter((v) => v.status === 'active');
  const expiringWarranties = warranties.filter((w) => w.status === 'vencendo');

  // Sector breakdown computation
  const sectorSpending = sectors.map((sec) => {
    const spent = expenses
      .filter((e) => e.sectorId === sec.id && e.status !== 'glosado')
      .reduce((acc, e) => acc + e.totalCost, 0);
    const budget = sec.monthlyBudget;
    const remaining = budget - spent;
    const percent = budget > 0 ? (spent / budget) * 100 : 0;
    return {
      id: sec.id,
      name: sec.name,
      code: sec.code,
      budget,
      spent,
      remaining,
      percent,
    };
  });

  // Recent maintenance expenses
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Controle Orçamentário & Operacional de Manutenção
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhamento em tempo real de saldo aprovado, verba consumida e disponibilidade da frota.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {currentUser.permissions.canManageExpenses && (
            <button
              onClick={() => setActiveTab('expenses')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Lançar Gasto / OS</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Ver Relatório Mensal</span>
          </button>
        </div>
      </div>

      {/* CORE FEATURE: Dashboard para controle de saldo x controle já consumido x restante disponível */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Execução Orçamentária Mensal (Setembro / 2026)
            </div>
            <div className="text-sm text-slate-600 mt-0.5">
              Balanço consolidado entre teto orçado aprovado por diretoria, desembolsos efetuados e saldo livre.
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
            <span className="text-slate-600 font-medium">Consumo Atual:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                metrics.monthlyConsumptionPercentage > 85
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : metrics.monthlyConsumptionPercentage > 60
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {metrics.monthlyConsumptionPercentage.toFixed(1)}% da verba mensal
            </span>
          </div>
        </div>

        {/* 3 Pillars Metric Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Saldo Orçado Total */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wide">1. Saldo Orçado Total</span>
              <Wallet className="w-4 h-4 text-slate-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {formatCurrency(metrics.totalMonthlyBudget)}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Orçamento Anual: {formatCurrency(metrics.totalAnnualBudget)}</span>
              <span>100% da verba</span>
            </div>
          </div>

          {/* 2. Já Consumido */}
          <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200/80">
            <div className="flex items-center justify-between text-amber-700 mb-2">
              <span className="text-xs font-medium uppercase tracking-wide">2. Controle Já Consumido</span>
              <TrendingDown className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-950 tabular-nums">
              {formatCurrency(metrics.totalSpentCurrentMonth)}
            </div>
            <div className="mt-2 text-[11px] text-amber-800 flex items-center justify-between">
              <span>Ano acumulado: {formatCurrency(metrics.totalSpentYear)}</span>
              <span className="font-semibold">{metrics.monthlyConsumptionPercentage.toFixed(1)}% do mês</span>
            </div>
          </div>

          {/* 3. Restante Disponível */}
          <div className={`p-4 rounded-lg border ${
            metrics.remainingMonthlyBudget >= 0 
              ? 'bg-emerald-50/60 border-emerald-200/80' 
              : 'bg-rose-50/60 border-rose-200/80'
          }`}>
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-xs font-medium uppercase tracking-wide">3. Restante Disponível</span>
              <CheckCircle2 className={`w-4 h-4 ${metrics.remainingMonthlyBudget >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
            </div>
            <div className={`text-2xl font-bold font-mono tabular-nums ${
              metrics.remainingMonthlyBudget >= 0 ? 'text-emerald-950' : 'text-rose-900'
            }`}>
              {formatCurrency(metrics.remainingMonthlyBudget)}
            </div>
            <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
              <span>Livre p/ novas OSs e reparos</span>
              <span className="font-semibold text-emerald-800">
                {(100 - metrics.monthlyConsumptionPercentage).toFixed(1)}% livre
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-mono">
            <span>R$ 0,00</span>
            <span className="font-medium text-slate-700">
              Progresso de Consumo: {formatCurrency(metrics.totalSpentCurrentMonth)} de {formatCurrency(metrics.totalMonthlyBudget)}
            </span>
            <span>{formatCurrency(metrics.totalMonthlyBudget)}</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
            <div
              className={`h-full transition-all duration-500 ${
                metrics.monthlyConsumptionPercentage > 90
                  ? 'bg-rose-500'
                  : metrics.monthlyConsumptionPercentage > 75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(metrics.monthlyConsumptionPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Secondary Operational Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Frota Operacional</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            {activeVehicles.length} / {vehicles.length}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            {((activeVehicles.length / (vehicles.length || 1)) * 100).toFixed(0)}% da frota em trânsito
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Veículos em Manutenção</span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-800 mt-2 tabular-nums">
            {vehiclesInMaintenance.length}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Parados em oficina credenciada
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Planos Preventivos</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            {maintenancePlans.length} ativos
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Revisões sistemáticas por KM
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Garantias Vencendo</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-700 mt-2 tabular-nums">
            {expiringWarranties.length} peças
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Expira em menos de 30 dias
          </p>
        </div>
      </div>

      {/* Two-Column Layout: Budget by Sector + Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumo por Setor */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-800">
                Consumo Orçamentário por Setor
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('sectors')}
              className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
            >
              <span>Gerenciar Setores</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {sectorSpending.map((s) => (
              <div key={s.id} className="py-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="font-medium text-slate-800 flex items-center gap-1.5">
                    <span>{s.name}</span>
                    <span className="text-[10px] font-mono text-slate-600">[{s.code}]</span>
                  </div>
                  <div className="font-mono tabular-nums text-slate-600">
                    <span className="font-semibold text-slate-900">{formatCurrency(s.spent)}</span>
                    <span className="text-slate-600"> / {formatCurrency(s.budget)}</span>
                  </div>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      s.percent > 90
                        ? 'bg-rose-500'
                        : s.percent > 70
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(s.percent, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1 font-mono">
                  <span>Disponível: {formatCurrency(s.remaining)}</span>
                  <span>{s.percent.toFixed(1)}% consumido</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas Ordens de Serviço & Gastos */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-800">
                Últimos Gastos com Peças & Serviços
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
            >
              <span>Ver Todos os Gastos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {recentExpenses.map((exp) => (
              <div key={exp.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5 max-w-[65%]">
                  <div className="font-medium text-slate-900 truncate">
                    {exp.description}
                  </div>
                  <div className="text-[11px] text-slate-600 flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-700">{exp.vehiclePlate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.providerName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{formatDate(exp.date)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900 tabular-nums">
                    {formatCurrency(exp.totalCost)}
                  </div>
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${
                    exp.status === 'pago' ? 'text-emerald-700' :
                    exp.status === 'aprovado' ? 'text-blue-700' :
                    exp.status === 'pendente' ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {exp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Attention Panel / Alerts */}
      {vehiclesInMaintenance.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-amber-900">
              Atenção: {vehiclesInMaintenance.length} veículo(s) atualmente em oficina mecânica
            </h4>
            <div className="text-xs text-amber-800 flex flex-wrap gap-2">
              {vehiclesInMaintenance.map((v) => (
                <span key={v.id} className="font-mono font-medium">
                  {v.plate} ({v.model}) · {v.currentKm ? formatKm(v.currentKm) : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
