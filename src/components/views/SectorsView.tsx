import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { Sector } from '../types/fleet';
import { formatCurrency } from '../utils/formatters';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  DollarSign,
  Truck,
  X,
  Check,
} from 'lucide-react';

export const SectorsView: React.FC = () => {
  const { sectors, vehicles, expenses, addSector, updateSector, deleteSector, currentUser } = useFleet();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [managerName, setManagerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState<number>(50000);
  const [annualBudget, setAnnualBudget] = useState<number>(600000);

  const canManage = currentUser.permissions.canManageSectors || currentUser.role === 'admin';

  const handleOpenCreate = () => {
    setEditingSector(null);
    setName('');
    setCode(`SET-0${sectors.length + 1}`);
    setCostCenter(`CC-${(sectors.length + 1) * 1010}-SP`);
    setManagerName('');
    setEmail('');
    setPhone('');
    setMonthlyBudget(40000);
    setAnnualBudget(480000);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sector: Sector) => {
    setEditingSector(sector);
    setName(sector.name);
    setCode(sector.code);
    setCostCenter(sector.costCenter);
    setManagerName(sector.managerName);
    setEmail(sector.email);
    setPhone(sector.phone);
    setMonthlyBudget(sector.monthlyBudget);
    setAnnualBudget(sector.annualBudget);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSector) {
      updateSector(editingSector.id, {
        name,
        code,
        costCenter,
        managerName,
        email,
        phone,
        monthlyBudget: Number(monthlyBudget),
        annualBudget: Number(annualBudget),
      });
    } else {
      addSector({
        name,
        code,
        costCenter,
        managerName,
        email,
        phone,
        monthlyBudget: Number(monthlyBudget),
        annualBudget: Number(annualBudget),
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, sName: string) => {
    const hasVehicles = vehicles.some((v) => v.sectorId === id);
    if (hasVehicles) {
      alert(`Não é possível excluir o setor "${sName}" pois existem veículos vinculados a ele.`);
      return;
    }
    if (confirm(`Deseja realmente excluir o setor "${sName}"?`)) {
      deleteSector(id);
    }
  };

  const filteredSectors = sectors.filter((s) => {
    const query = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query) ||
      s.costCenter.toLowerCase().includes(query) ||
      s.managerName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Cadastro de Setores & Centros de Custo
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Defina divisões operacionais, orçamentos mensais/anuais e gestores responsáveis pela frota.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Setor</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, código, centro de custo ou gestor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
          </input>
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums">
          Total de setores: <span className="font-semibold text-slate-800">{filteredSectors.length}</span>
        </div>
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSectors.map((sector) => {
          const sectorVehicles = vehicles.filter((v) => v.sectorId === sector.id);
          const sectorSpent = expenses
            .filter((e) => e.sectorId === sector.id && e.status !== 'glosado')
            .reduce((acc, e) => acc + e.totalCost, 0);
          const remaining = sector.monthlyBudget - sectorSpent;
          const consumptionPct = sector.monthlyBudget > 0 ? (sectorSpent / sector.monthlyBudget) * 100 : 0;

          return (
            <div
              key={sector.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {sector.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-0.5">
                        <span>{sector.code}</span>
                        <span>·</span>
                        <span>{sector.costCenter}</span>
                      </div>
                    </div>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(sector)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        title="Editar Setor"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sector.id, sector.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Excluir Setor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Manager info */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1">
                  <div className="text-slate-500">
                    Gestor: <span className="font-medium text-slate-800">{sector.managerName || 'Não atribuído'}</span>
                  </div>
                  {sector.email && (
                    <div className="text-slate-500 text-[11px] truncate">
                      Email: <span className="text-slate-700">{sector.email}</span>
                    </div>
                  )}
                  {sector.phone && (
                    <div className="text-slate-500 text-[11px]">
                      Tel: <span className="text-slate-700">{sector.phone}</span>
                    </div>
                  )}
                </div>

                {/* Vehicles count */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Frota vinculada: <strong className="text-slate-900 font-mono">{sectorVehicles.length}</strong> veículo(s)
                  </span>
                </div>
              </div>

              {/* Financial Box */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Orçamento Mensal:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatCurrency(sector.monthlyBudget)}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      consumptionPct > 90
                        ? 'bg-rose-500'
                        : consumptionPct > 70
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(consumptionPct, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Gasto: {formatCurrency(sectorSpent)}</span>
                  <span className={remaining >= 0 ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                    Saldo: {formatCurrency(remaining)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingSector ? 'Editar Setor' : 'Cadastrar Novo Setor'}
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
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Nome do Setor / Departamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Logística & Distribuição Sudeste"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Código do Setor
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ex: LOG-01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Centro de Custo (ERP)
                  </label>
                  <input
                    type="text"
                    required
                    value={costCenter}
                    onChange={(e) => setCostCenter(e.target.value)}
                    placeholder="Ex: CC-1010-SP"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Gestor Responsável
                  </label>
                  <input
                    type="text"
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="Nome completo do gestor"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Telefone de Contato
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    E-mail do Gestor
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gestor@empresa.com.br"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Orçamento Mensal (R$) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={monthlyBudget}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMonthlyBudget(val);
                      setAnnualBudget(val * 12);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Orçamento Anual (R$) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={annualBudget}
                    onChange={(e) => setAnnualBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
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
                  <span>{editingSector ? 'Salvar Alterações' : 'Criar Setor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
