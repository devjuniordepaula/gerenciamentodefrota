import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Filter,
  DollarSign,
  Calendar,
  Building2,
  FileText,
  AlertCircle,
} from 'lucide-react';

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const FinancialCalendarView: React.FC = () => {
  const { expenses, sectors, metrics } = useFleet();
  const [viewMode, setViewMode] = useState<'annual' | 'monthly'>('annual');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // 8 = September (0-indexed)
  const [sectorFilter, setSectorFilter] = useState<string>('all');

  // Filter expenses by selected year and sector
  const filteredExpenses = expenses.filter((e) => {
    const isYear = e.date.startsWith(`${selectedYear}-`);
    const isSector = sectorFilter === 'all' || e.sectorId === sectorFilter;
    return isYear && isSector && e.status !== 'glosado';
  });

  // Calculate month-by-month financial values (0 to 11)
  const totalMonthlyBudget = sectorFilter === 'all'
    ? metrics.totalMonthlyBudget
    : sectors.find((s) => s.id === sectorFilter)?.monthlyBudget || 0;

  const monthlyData = MONTH_NAMES.map((name, idx) => {
    const monthPrefix = `${selectedYear}-${String(idx + 1).padStart(2, '0')}`;
    const monthExpenses = filteredExpenses.filter((e) => e.date.startsWith(monthPrefix));
    const spent = monthExpenses.reduce((acc, e) => acc + e.totalCost, 0);
    const budget = totalMonthlyBudget;
    const remaining = budget - spent;
    const percent = budget > 0 ? (spent / budget) * 100 : 0;
    const count = monthExpenses.length;

    return {
      monthIndex: idx,
      monthName: name,
      budget,
      spent,
      remaining,
      percent,
      count,
      expenses: monthExpenses,
    };
  });

  const totalAnnualBudget = monthlyData.reduce((acc, m) => acc + m.budget, 0);
  const totalAnnualSpent = monthlyData.reduce((acc, m) => acc + m.spent, 0);
  const totalAnnualRemaining = totalAnnualBudget - totalAnnualSpent;
  const annualConsumptionPct = totalAnnualBudget > 0 ? (totalAnnualSpent / totalAnnualBudget) * 100 : 0;

  // Monthly Calendar Grid calculation
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 = Sunday

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Controle Financeiro de Gastos & Calendário Anual
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhe o orçamento de manutenção mês a mês, desvios financeiros e fluxo diário de pagamentos.
          </p>
        </div>

        {/* View Switcher: Anual vs Mensal */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode('annual')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'annual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Visão Anual (12 Meses)
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grade Calendário Mensal
          </button>
        </div>
      </div>

      {/* Control bar: Year, Sector filter, metrics */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <button
              onClick={() => setSelectedYear((y) => y - 1)}
              className="p-1 hover:bg-slate-200 rounded text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-slate-900 text-sm px-2">
              {selectedYear}
            </span>
            <button
              onClick={() => setSelectedYear((y) => y + 1)}
              className="p-1 hover:bg-slate-200 rounded text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sector filter */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="text-xs py-1.5 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 font-medium"
          >
            <option value="all">Consolidado - Todos os Setores</option>
            {sectors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        {/* Global Annual KPI */}
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
          <div>
            <span className="text-slate-500">Teto Anual:</span>{' '}
            <strong className="text-slate-900">{formatCurrency(totalAnnualBudget)}</strong>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            <span className="text-slate-500">Realizado Ano:</span>{' '}
            <strong className="text-amber-800">{formatCurrency(totalAnnualSpent)}</strong>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            <span className="text-slate-500">Saldo Livre:</span>{' '}
            <strong className={totalAnnualRemaining >= 0 ? 'text-emerald-800' : 'text-rose-800'}>
              {formatCurrency(totalAnnualRemaining)}
            </strong>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: ANNUAL 12-MONTH OVERVIEW */}
      {viewMode === 'annual' && (
        <div className="space-y-6">
          {/* Annual 12-month visual progress bar cards */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Comparativo de Execução Orçamentária - {selectedYear}
              </h3>
              <span className="text-xs text-slate-500">
                Mês a mês: Orçamento Previsto x Gastos Reais com Peças e Oficinas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {monthlyData.map((m) => {
                const isOverBudget = m.spent > m.budget;
                const isCurrentMonth = m.monthIndex === 8 && selectedYear === 2026;

                return (
                  <div
                    key={m.monthIndex}
                    onClick={() => {
                      setSelectedMonth(m.monthIndex);
                      setViewMode('monthly');
                    }}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isCurrentMonth
                        ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-300'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900">
                        {m.monthName}
                      </span>
                      {isCurrentMonth && (
                        <span className="text-[9px] font-bold uppercase bg-amber-200 text-amber-900 px-1 rounded">
                          Mês Atual
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-[11px] text-slate-500">Realizado:</span>
                        <span className="font-bold text-slate-900 tabular-nums">
                          {formatCurrency(m.spent)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>Orçado:</span>
                        <span>{formatCurrency(m.budget)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full ${
                          m.percent > 90
                            ? 'bg-rose-500'
                            : m.percent > 70
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(m.percent, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono mt-1.5">
                      <span className="text-slate-400">{m.count} OSs</span>
                      <span className={m.remaining >= 0 ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                        {m.remaining >= 0 ? `+${formatCurrency(m.remaining)}` : formatCurrency(m.remaining)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Ledger Table for 12 months */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Demonstrativo Financeiro Consolidado Anual ({selectedYear})
              </h4>
              <span className="text-xs text-slate-500">
                Exportável para prestação de contas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-4">Mês</th>
                    <th className="py-2.5 px-4 text-right">Orçamento Previsto</th>
                    <th className="py-2.5 px-4 text-right">Gasto Realizado</th>
                    <th className="py-2.5 px-4 text-right">Saldo Disponível</th>
                    <th className="py-2.5 px-4 text-right">Consumo (%)</th>
                    <th className="py-2.5 px-4 text-center">Nº de OSs</th>
                    <th className="py-2.5 px-4 text-center">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {monthlyData.map((m) => {
                    const isOver = m.spent > m.budget;
                    return (
                      <tr key={m.monthIndex} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-sans font-semibold text-slate-900">
                          {m.monthName}
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums">
                          {formatCurrency(m.budget)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                          {formatCurrency(m.spent)}
                        </td>
                        <td className={`py-2.5 px-4 text-right tabular-nums font-semibold ${
                          m.remaining >= 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}>
                          {formatCurrency(m.remaining)}
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums">
                          {m.percent.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {m.count}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                            isOver ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {isOver ? 'Acima do Teto' : 'Dentro do Teto'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td className="py-3 px-4 font-sans">TOTAL ANUAL {selectedYear}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(totalAnnualBudget)}</td>
                    <td className="py-3 px-4 text-right text-amber-900">{formatCurrency(totalAnnualSpent)}</td>
                    <td className="py-3 px-4 text-right text-emerald-800">{formatCurrency(totalAnnualRemaining)}</td>
                    <td className="py-3 px-4 text-right">{annualConsumptionPct.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-center">{filteredExpenses.length}</td>
                    <td className="py-3 px-4 text-center text-emerald-800">Aprovado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: MONTHLY INTERACTIVE CALENDAR GRID */}
      {viewMode === 'monthly' && (
        <div className="space-y-5">
          {/* Month selector navigation */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedMonth((m) => (m === 0 ? 11 : m - 1))}
                className="p-1 hover:bg-slate-100 rounded text-slate-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-base font-bold text-slate-900 min-w-[140px] text-center">
                {MONTH_NAMES[selectedMonth]} {selectedYear}
              </h3>
              <button
                onClick={() => setSelectedMonth((m) => (m === 11 ? 0 : m + 1))}
                className="p-1 hover:bg-slate-100 rounded text-slate-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs font-mono tabular-nums flex items-center gap-3">
              <span>Gasto no mês: <strong className="text-slate-900">{formatCurrency(monthlyData[selectedMonth].spent)}</strong></span>
              <span>·</span>
              <span>Saldo: <strong className="text-emerald-800">{formatCurrency(monthlyData[selectedMonth].remaining)}</strong></span>
            </div>
          </div>

          {/* 7-Day Grid Calendar */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-600 py-2">
              <div>Dom</div>
              <div>Seg</div>
              <div>Ter</div>
              <div>Qua</div>
              <div>Qui</div>
              <div>Sex</div>
              <div>Sáb</div>
            </div>

            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 text-xs">
              {blanks.map((b) => (
                <div key={`blank-${b}`} className="min-h-[90px] bg-slate-50/40 p-2" />
              ))}

              {daysArray.map((day) => {
                const dayStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayExpenses = filteredExpenses.filter((e) => e.date === dayStr);
                const dayTotal = dayExpenses.reduce((acc, e) => acc + e.totalCost, 0);

                return (
                  <div
                    key={day}
                    className={`min-h-[90px] p-2 flex flex-col justify-between transition-colors ${
                      dayExpenses.length > 0 ? 'bg-amber-50/30 hover:bg-amber-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-700">{day}</span>
                      {dayExpenses.length > 0 && (
                        <span className="text-[9px] font-mono font-bold px-1 rounded bg-slate-800 text-white">
                          {dayExpenses.length} OS
                        </span>
                      )}
                    </div>

                    {dayExpenses.length > 0 ? (
                      <div className="mt-1 space-y-0.5">
                        <div className="font-mono font-bold text-slate-900 tabular-nums text-[11px]">
                          {formatCurrency(dayTotal)}
                        </div>
                        {dayExpenses.map((exp) => (
                          <div
                            key={exp.id}
                            className="text-[10px] text-slate-600 truncate border-l-2 border-amber-500 pl-1"
                            title={`${exp.workOrderNumber}: ${exp.description} (${exp.vehiclePlate})`}
                          >
                            {exp.vehiclePlate} · {exp.description}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-300 font-mono text-center">Sem OS</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
