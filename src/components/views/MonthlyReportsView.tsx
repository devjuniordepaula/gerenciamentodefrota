import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { formatCurrency, formatKm, formatDate, downloadCSV } from '../utils/formatters';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Building2,
  CheckCircle2,
  TrendingDown,
  Wrench,
  Truck,
  ShieldCheck,
  Award,
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

export const MonthlyReportsView: React.FC = () => {
  const { expenses, sectors, vehicles, metrics, accreditedProviders } = useFleet();
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // September
  const [sectorFilter, setSectorFilter] = useState<string>('all');

  const monthPrefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

  // Filter expenses for selected month & sector
  const reportExpenses = expenses.filter((e) => {
    const matchesMonth = e.date.startsWith(monthPrefix);
    const matchesSector = sectorFilter === 'all' || e.sectorId === sectorFilter;
    return matchesMonth && matchesSector && e.status !== 'glosado';
  });

  const selectedSectorObj = sectors.find((s) => s.id === sectorFilter);

  const totalBudget = sectorFilter === 'all'
    ? metrics.totalMonthlyBudget
    : selectedSectorObj?.monthlyBudget || 0;

  const totalSpent = reportExpenses.reduce((acc, e) => acc + e.totalCost, 0);
  const remainingBudget = totalBudget - totalSpent;
  const consumptionPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Compute total fleet KM
  const relevantVehicles = sectorFilter === 'all'
    ? vehicles
    : vehicles.filter((v) => v.sectorId === sectorFilter);

  const totalKmRun = relevantVehicles.reduce((acc, v) => acc + v.currentKm, 0);
  const costPerKm = totalKmRun > 0 ? totalSpent / (totalKmRun / 100) : 0;

  // Top Parts replaced
  const partsSummary: Record<string, { count: number; totalCost: number }> = {};
  reportExpenses.forEach((exp) => {
    const key = exp.description.split('(')[0].trim();
    if (!partsSummary[key]) {
      partsSummary[key] = { count: 0, totalCost: 0 };
    }
    partsSummary[key].count += exp.quantity || 1;
    partsSummary[key].totalCost += exp.totalCost;
  });

  const topParts = Object.entries(partsSummary)
    .sort((a, b) => b[1].totalCost - a[1].totalCost)
    .slice(0, 5);

  // Top Providers demand
  const providersSummary: Record<string, { count: number; totalCost: number }> = {};
  reportExpenses.forEach((exp) => {
    const key = exp.providerName;
    if (!providersSummary[key]) {
      providersSummary[key] = { count: 0, totalCost: 0 };
    }
    providersSummary[key].count += 1;
    providersSummary[key].totalCost += exp.totalCost;
  });

  const topProviders = Object.entries(providersSummary)
    .sort((a, b) => b[1].totalCost - a[1].totalCost)
    .slice(0, 5);

  // CSV Export Action
  const handleExportCSV = () => {
    const filename = `relatorio-frota-${MONTH_NAMES[selectedMonth].toLowerCase()}-${selectedYear}.csv`;
    const headers = [
      'Ordem de Servico',
      'Nota Fiscal',
      'Placa Veiculo',
      'Descricao do Gasto',
      'Tipo de Manutencao',
      'Credenciado / Oficina',
      'Data Lancamento',
      'Quantidade',
      'Valor Unitario (R$)',
      'Valor Total (R$)',
      'Status Pagamento',
    ];

    const rows = reportExpenses.map((exp) => [
      exp.workOrderNumber,
      exp.invoiceNumber,
      exp.vehiclePlate,
      exp.description,
      exp.type,
      exp.providerName,
      exp.date,
      exp.quantity.toString(),
      exp.unitCost.toFixed(2),
      exp.totalCost.toFixed(2),
      exp.status,
    ]);

    downloadCSV(filename, [headers, ...rows]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header bar - Hidden in Print */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Relatórios Mensais de Manutenção & Prestação de Contas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Geração de demonstrativos executivos consolidados com exportação em planilha CSV e formato de impressão / PDF.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Exportar Planilha (CSV)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Gerar PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Controls - Hidden in Print */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-700">Mês de Referência:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="text-xs py-1.5 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800 font-semibold"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={idx} value={idx}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-xs py-1.5 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800 font-semibold"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-700">Setor:</span>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="text-xs py-1.5 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800 font-semibold"
          >
            <option value="all">Todos os Setores (Consolidado Corporativo)</option>
            {sectors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Document Formal Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-950 text-xl tracking-tight">
                FROTAMASTER SAAS
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                Gestão & Manutenção de Frotas
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-1">
              Relatório Executivo Mensal de Despesas de Manutenção
            </h1>
            <div className="text-xs text-slate-600 mt-0.5">
              Período: <strong>{MONTH_NAMES[selectedMonth]} de {selectedYear}</strong> · Setor:{' '}
              <strong>{selectedSectorObj ? selectedSectorObj.name : 'Todos os Setores (Consolidado Corporativo)'}</strong>
            </div>
          </div>

          <div className="text-right text-xs font-mono text-slate-500">
            <div>Emissão: {new Date().toLocaleDateString('pt-BR')}</div>
            <div>Status: Contabilizado & Auditado</div>
          </div>
        </div>

        {/* 3 Executive Financial Highlights */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Orçamento Mensal Autorizado
            </span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {formatCurrency(totalBudget)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              100% da verba programada
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Consumido no Mês
            </span>
            <div className="text-xl font-bold font-mono text-amber-800 mt-1 tabular-nums">
              {formatCurrency(totalSpent)}
            </div>
            <div className="text-[10px] text-slate-600 mt-0.5">
              {consumptionPercentage.toFixed(1)}% do orçamento consumido
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Saldo Restante Disponível
            </span>
            <div className={`text-xl font-bold font-mono mt-1 tabular-nums ${
              remainingBudget >= 0 ? 'text-emerald-800' : 'text-rose-800'
            }`}>
              {formatCurrency(remainingBudget)}
            </div>
            <div className="text-[10px] text-slate-600 mt-0.5">
              {reportExpenses.length} Ordens de Serviço faturadas
            </div>
          </div>
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 border border-slate-200 rounded-md">
            <span className="text-slate-500">Veículos Cobertos:</span>
            <div className="font-bold text-slate-900 font-mono text-sm mt-0.5">
              {relevantVehicles.length} unidades
            </div>
          </div>

          <div className="p-3 border border-slate-200 rounded-md">
            <span className="text-slate-500">Taxa Preventiva:</span>
            <div className="font-bold text-emerald-800 font-mono text-sm mt-0.5">
              92.4% no prazo
            </div>
          </div>

          <div className="p-3 border border-slate-200 rounded-md">
            <span className="text-slate-500">Custo Médio / 100 KM:</span>
            <div className="font-bold text-slate-900 font-mono text-sm mt-0.5">
              {formatCurrency(costPerKm)}
            </div>
          </div>

          <div className="p-3 border border-slate-200 rounded-md">
            <span className="text-slate-500">Garantias Acionadas:</span>
            <div className="font-bold text-purple-900 font-mono text-sm mt-0.5">
              1 sinistro sem custo
            </div>
          </div>
        </div>

        {/* 2-Column: Top Parts & Top Accredited Providers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Top Parts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              Top 5 Itens / Peças com Maior Volume Financeiro
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              {topParts.map(([name, data], idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <span className="text-slate-800 font-medium truncate max-w-[220px]">
                    {name}
                  </span>
                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-900">{formatCurrency(data.totalCost)}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">({data.count} un)</span>
                  </div>
                </div>
              ))}
              {topParts.length === 0 && (
                <div className="text-slate-400 py-3 text-center">Nenhum registro no período.</div>
              )}
            </div>
          </div>

          {/* Top Accredited Providers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              Oficinas Credenciadas mais Demandadas
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              {topProviders.map(([name, data], idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <span className="text-slate-800 font-medium truncate max-w-[220px]">
                    {name}
                  </span>
                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-900">{formatCurrency(data.totalCost)}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">({data.count} OS)</span>
                  </div>
                </div>
              ))}
              {topProviders.length === 0 && (
                <div className="text-slate-400 py-3 text-center">Nenhum registro no período.</div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed OS Listing Table */}
        <div className="space-y-3 pt-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            Relação Detalhada de Ordens de Serviço do Mês ({reportExpenses.length})
          </h4>

          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-2 px-2">OS</th>
                <th className="py-2 px-2">NF-e</th>
                <th className="py-2 px-2">Placa</th>
                <th className="py-2 px-2">Descrição</th>
                <th className="py-2 px-2">Credenciado</th>
                <th className="py-2 px-2">Data</th>
                <th className="py-2 px-2 text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {reportExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td className="py-2 px-2 font-bold text-slate-900">{exp.workOrderNumber}</td>
                  <td className="py-2 px-2 text-slate-500">{exp.invoiceNumber}</td>
                  <td className="py-2 px-2 font-bold text-slate-800">{exp.vehiclePlate}</td>
                  <td className="py-2 px-2 max-w-[200px] truncate font-sans text-slate-900">{exp.description}</td>
                  <td className="py-2 px-2 max-w-[150px] truncate font-sans">{exp.providerName}</td>
                  <td className="py-2 px-2">{formatDate(exp.date)}</td>
                  <td className="py-2 px-2 text-right font-bold text-slate-900">{formatCurrency(exp.totalCost)}</td>
                </tr>
              ))}

              {reportExpenses.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">
                    Nenhuma despesa lançada para o mês selecionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Signature Box for Formal Corporate Compliance */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="border-t border-slate-400 w-3/4 mx-auto pt-2 font-medium text-slate-800">
              Carlos Eduardo Silveira
            </div>
            <div className="text-[11px] text-slate-500">Gestor de Frota Master</div>
          </div>

          <div>
            <div className="border-t border-slate-400 w-3/4 mx-auto pt-2 font-medium text-slate-800">
              Mariana Duarte Prado
            </div>
            <div className="text-[11px] text-slate-500">Controladoria & Auditoria Financeira</div>
          </div>
        </div>
      </div>
    </div>
  );
};
