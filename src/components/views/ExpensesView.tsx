import React, { useState } from 'react';
import { useFleet } from '../../app/context/FleetContext';
import { Expense, ExpenseType, ExpenseStatus } from '../../app/types/fleet';
import { formatCurrency, formatDate } from '../../lib/utils/formatters'


import {
  Receipt,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
  Check,
  X,
  FileCheck2,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  peca: 'Peça de Reposição',
  servico: 'Mão de Obra / Serviço',
  oleo_fluidos: 'Óleos & Fluidos',
  pneus: 'Pneumáticos & Rodas',
  funilaria: 'Funilaria & Pintura',
};

const STATUS_CONFIG: Record<ExpenseStatus, { label: string; class: string }> = {
  pago: { label: 'Pago / Liquidado', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  aprovado: { label: 'Aprovado p/ Pagamento', class: 'bg-blue-50 text-blue-800 border-blue-200' },
  pendente: { label: 'Aguardando Aprovação', class: 'bg-amber-50 text-amber-900 border-amber-200' },
  glosado: { label: 'Glosado / Recusado', class: 'bg-rose-50 text-rose-800 border-rose-200' },
};

export const ExpensesView: React.FC = () => {
  const { expenses, vehicles, sectors, accreditedProviders, addExpense, updateExpense, deleteExpense, approveExpense, currentUser } = useFleet();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form State
  const [workOrderNumber, setWorkOrderNumber] = useState('');
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [sectorId, setSectorId] = useState(sectors[0]?.id || '');
  const [providerId, setProviderId] = useState(accreditedProviders[0]?.id || '');
  const [type, setType] = useState<ExpenseType>('peca');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitCost, setUnitCost] = useState<number>(500);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [status, setStatus] = useState<ExpenseStatus>('pendente');
  const [notes, setNotes] = useState('');

  const perms = currentUser.permissions;
  const canManage = perms.canManageExpenses || currentUser.role === 'admin';
  const canApprove = perms.canApproveExpenses || currentUser.role === 'admin';

  // Metrics
  const totalExpenses = expenses.reduce((acc, e) => (e.status !== 'glosado' ? acc + e.totalCost : acc), 0);
  const totalPaid = expenses.filter((e) => e.status === 'pago').reduce((acc, e) => acc + e.totalCost, 0);
  const totalPending = expenses.filter((e) => e.status === 'pendente').reduce((acc, e) => acc + e.totalCost, 0);

  const handleOpenCreate = () => {
    setEditingExpense(null);
    setWorkOrderNumber(`OS-2026-${Math.floor(Math.random() * 899 + 100)}`);
    const defaultVeh = vehicles[0];
    setVehicleId(defaultVeh?.id || '');
    setSectorId(defaultVeh?.sectorId || sectors[0]?.id || '');
    setProviderId(accreditedProviders[0]?.id || '');
    setType('peca');
    setDescription('');
    setQuantity(1);
    setUnitCost(850);
    setDate(new Date().toISOString().split('T')[0]);
    setInvoiceNumber(`NF-e 0${Math.floor(Math.random() * 89999 + 10000)}`);
    setStatus('pendente');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Expense) => {
    setEditingExpense(exp);
    setWorkOrderNumber(exp.workOrderNumber);
    setVehicleId(exp.vehicleId);
    setSectorId(exp.sectorId);
    setProviderId(exp.providerId);
    setType(exp.type);
    setDescription(exp.description);
    setQuantity(exp.quantity);
    setUnitCost(exp.unitCost);
    setDate(exp.date);
    setInvoiceNumber(exp.invoiceNumber);
    setStatus(exp.status);
    setNotes(exp.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const selVeh = vehicles.find((v) => v.id === vehicleId);
    const selProv = accreditedProviders.find((p) => p.id === providerId);

    const vehiclePlate = selVeh ? selVeh.plate : 'FROTA';
    const providerName = selProv ? selProv.name : 'Fornecedor';
    const totalCost = Number(quantity) * Number(unitCost);

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        workOrderNumber,
        vehicleId,
        vehiclePlate,
        sectorId,
        providerId,
        providerName,
        type,
        description,
        quantity: Number(quantity),
        unitCost: Number(unitCost),
        totalCost,
        date,
        invoiceNumber,
        status,
        notes,
      });
    } else {
      addExpense({
        workOrderNumber,
        vehicleId,
        vehiclePlate,
        sectorId,
        providerId,
        providerName,
        type,
        description,
        quantity: Number(quantity),
        unitCost: Number(unitCost),
        totalCost,
        date,
        invoiceNumber,
        status,
        notes,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, os: string) => {
    if (confirm(`Deseja remover o lançamento da ${os}?`)) {
      deleteExpense(id);
    }
  };

  const handleApprove = (exp: Expense) => {
    approveExpense(exp.id, currentUser.name);
  };

  const filteredExpenses = expenses.filter((e) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      e.description.toLowerCase().includes(q) ||
      e.vehiclePlate.toLowerCase().includes(q) ||
      e.workOrderNumber.toLowerCase().includes(q) ||
      e.invoiceNumber.toLowerCase().includes(q) ||
      e.providerName.toLowerCase().includes(q);

    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesSector = sectorFilter === 'all' || e.sectorId === sectorFilter;

    return matchesSearch && matchesType && matchesStatus && matchesSector;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Gastos com Peças & Serviços (Ordens de Serviço)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro contábil de manutenções, peças aplicadas, notas fiscais e fluxo de aprovação de despesas.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Lançar Gasto / Nova OS</span>
          </button>
        )}
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total de Gastos Registrados</span>
            <Receipt className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {expenses.length} lançamentos contabilizados
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Liquidado / Pago</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1 tabular-nums">
            {formatCurrency(totalPaid)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Ordens de serviço compensadas
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Pendente de Aprovação</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-800 mt-1 tabular-nums">
            {formatCurrency(totalPending)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Aguardando validação do auditor
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por descrição, placa, OS, NF ou oficina..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 font-medium"
          >
            <option value="all">Todos os Status</option>
            <option value="pago">Pago</option>
            <option value="aprovado">Aprovado</option>
            <option value="pendente">Pendente</option>
            <option value="glosado">Glosado</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 font-medium"
          >
            <option value="all">Todos os Tipos</option>
            <option value="peca">Peça de Reposição</option>
            <option value="servico">Mão de Obra</option>
            <option value="oleo_fluidos">Óleos & Fluidos</option>
            <option value="pneus">Pneus</option>
            <option value="funilaria">Funilaria</option>
          </select>

          {/* Sector Filter */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 font-medium"
          >
            <option value="all">Todos os Setores</option>
            {sectors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-mono">
                <th className="py-3 px-4">OS / NF-e</th>
                <th className="py-3 px-4">Veículo</th>
                <th className="py-3 px-4">Descrição da Despesa</th>
                <th className="py-3 px-4">Oficina Credenciada</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4 text-right">Valor Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredExpenses.map((exp) => {
                const statusInfo = STATUS_CONFIG[exp.status] || STATUS_CONFIG.pendente;

                return (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      <div>{exp.workOrderNumber}</div>
                      <div className="text-[11px] text-slate-400">{exp.invoiceNumber}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                        {exp.vehiclePlate}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 truncate" title={exp.description}>
                        {exp.description}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {EXPENSE_TYPE_LABELS[exp.type]} · Qtd: {exp.quantity}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-[180px] truncate" title={exp.providerName}>
                      {exp.providerName}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {formatDate(exp.date)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {formatCurrency(exp.totalCost)}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded border font-semibold ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {exp.status === 'pendente' && canApprove && (
                          <button
                            onClick={() => handleApprove(exp)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Aprovar Gasto"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {canManage && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(exp)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded"
                              title="Editar Despesa"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(exp.id, exp.workOrderNumber)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="Excluir Despesa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Nenhum gasto encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Expense Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-900">
                {editingExpense ? 'Editar Gasto / OS' : 'Lançar Novo Gasto / OS'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Número da Ordem de Serviço (OS) *
                  </label>
                  <input
                    type="text"
                    required
                    value={workOrderNumber}
                    onChange={(e) => setWorkOrderNumber(e.target.value)}
                    placeholder="OS-2026-402"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Nota Fiscal (NF-e)
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="NF-e 050.412"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Veículo *
                  </label>
                  <select
                    value={vehicleId}
                    onChange={(e) => {
                      setVehicleId(e.target.value);
                      const veh = vehicles.find((v) => v.id === e.target.value);
                      if (veh) setSectorId(veh.sectorId);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.plate} - {v.brand} {v.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Setor Responsável
                  </label>
                  <select
                    value={sectorId}
                    onChange={(e) => setSectorId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Oficina Credenciada / Fornecedor *
                  </label>
                  <select
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    {accreditedProviders.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.tradeName || p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Categoria do Gasto
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ExpenseType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="peca">Peça de Reposição</option>
                    <option value="servico">Mão de Obra / Serviço</option>
                    <option value="oleo_fluidos">Óleos & Fluidos</option>
                    <option value="pneus">Pneumáticos & Rodas</option>
                    <option value="funilaria">Funilaria & Pintura</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Descrição Detalhada do Item / Serviço *
                  </label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Pastilhas de Freio Dianteiras Fras-le com sensores"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Valor Unitário (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Data da Execução / Nota
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Status de Liquidação
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ExpenseStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="pendente">Aguardando Aprovação</option>
                    <option value="aprovado">Aprovado p/ Pagamento</option>
                    <option value="pago">Pago / Liquidado</option>
                    <option value="glosado">Glosado / Recusado</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between font-mono">
                    <span className="text-slate-600 font-medium">Valor Total da OS:</span>
                    <span className="text-base font-bold text-slate-900">
                      {formatCurrency(Number(quantity) * Number(unitCost))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingExpense ? 'Salvar Despesa' : 'Registrar Despesa'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
