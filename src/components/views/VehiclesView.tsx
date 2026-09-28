import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { Vehicle, VehicleCategory, VehicleStatus } from '../types/fleet';
import { formatKm, formatDate } from '../utils/formatters';
import {
  Truck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  Gauge,
  Calendar,
  X,
  Check,
  Wrench,
  Fuel,
} from 'lucide-react';

const CATEGORIES: VehicleCategory[] = [
  'Caminhão Pesado',
  'Caminhão Médio',
  'Van de Carga',
  'Utilitário',
  'Passeio',
];

const STATUS_LABELS: Record<VehicleStatus, { label: string; class: string }> = {
  active: { label: 'Operacional / Ativo', class: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  in_maintenance: { label: 'Em Manutenção', class: 'text-amber-800 bg-amber-50 border-amber-200' },
  standby: { label: 'Reserva Técnica', class: 'text-blue-700 bg-blue-50 border-blue-200' },
  inactive: { label: 'Inativo / Baixado', class: 'text-rose-700 bg-rose-50 border-rose-200' },
};

export const VehiclesView: React.FC = () => {
  const { vehicles, sectors, expenses, addVehicle, updateVehicle, deleteVehicle, currentUser } = useFleet();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Selected vehicle for maintenance drawer/history
  const [selectedVehicleHistory, setSelectedVehicleHistory] = useState<Vehicle | null>(null);

  // Form State
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState<number>(2024);
  const [category, setCategory] = useState<VehicleCategory>('Caminhão Pesado');
  const [chassis, setChassis] = useState('');
  const [renavam, setRenavam] = useState('');
  const [sectorId, setSectorId] = useState(sectors[0]?.id || '');
  const [currentKm, setCurrentKm] = useState<number>(50000);
  const [fuelType, setFuelType] = useState<Vehicle['fuelType']>('Diesel S10');
  const [status, setStatus] = useState<VehicleStatus>('active');
  const [driverName, setDriverName] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('2024-01-15');
  const [nextMaintenanceKm, setNextMaintenanceKm] = useState<number>(60000);
  const [averageConsumptionKmPerL, setAverageConsumptionKmPerL] = useState<number>(3.5);

  const canManage = currentUser.permissions.canManageVehicles || currentUser.role === 'admin';

  const handleOpenCreate = () => {
    setEditingVehicle(null);
    setPlate('');
    setModel('');
    setBrand('');
    setYear(2024);
    setCategory('Caminhão Pesado');
    setChassis('');
    setRenavam('');
    setSectorId(sectors[0]?.id || '');
    setCurrentKm(30000);
    setFuelType('Diesel S10');
    setStatus('active');
    setDriverName('');
    setAcquisitionDate(new Date().toISOString().split('T')[0]);
    setNextMaintenanceKm(40000);
    setAverageConsumptionKmPerL(3.2);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (veh: Vehicle) => {
    setEditingVehicle(veh);
    setPlate(veh.plate);
    setModel(veh.model);
    setBrand(veh.brand);
    setYear(veh.year);
    setCategory(veh.category);
    setChassis(veh.chassis);
    setRenavam(veh.renavam);
    setSectorId(veh.sectorId);
    setCurrentKm(veh.currentKm);
    setFuelType(veh.fuelType);
    setStatus(veh.status);
    setDriverName(veh.driverName);
    setAcquisitionDate(veh.acquisitionDate);
    setNextMaintenanceKm(veh.nextMaintenanceKm);
    setAverageConsumptionKmPerL(veh.averageConsumptionKmPerL);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim() || !model.trim()) return;

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, {
        plate: plate.toUpperCase(),
        model,
        brand,
        year: Number(year),
        category,
        chassis,
        renavam,
        sectorId,
        currentKm: Number(currentKm),
        fuelType,
        status,
        driverName,
        acquisitionDate,
        nextMaintenanceKm: Number(nextMaintenanceKm),
        averageConsumptionKmPerL: Number(averageConsumptionKmPerL),
      });
    } else {
      addVehicle({
        plate: plate.toUpperCase(),
        model,
        brand,
        year: Number(year),
        category,
        chassis,
        renavam,
        sectorId,
        currentKm: Number(currentKm),
        fuelType,
        status,
        driverName,
        acquisitionDate,
        lastMaintenanceDate: new Date().toISOString().split('T')[0],
        nextMaintenanceKm: Number(nextMaintenanceKm),
        averageConsumptionKmPerL: Number(averageConsumptionKmPerL),
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, vPlate: string) => {
    if (confirm(`Deseja realmente remover o veículo ${vPlate}?`)) {
      deleteVehicle(id);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      v.plate.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.brand.toLowerCase().includes(q) ||
      v.driverName.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Cadastro & Controle da Frota
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inventário operacional de cavalos mecânicos, caminhões, vans e utilitários da frota.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Veículo</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por placa, modelo, marca ou motorista..."
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
            <option value="active">Operacional / Ativo</option>
            <option value="in_maintenance">Em Manutenção</option>
            <option value="standby">Reserva Técnica</option>
            <option value="inactive">Inativo</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 font-medium"
          >
            <option value="all">Todas as Categorias</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map((veh) => {
          const sector = sectors.find((s) => s.id === veh.sectorId);
          const statusInfo = STATUS_LABELS[veh.status] || STATUS_LABELS.active;

          const kmToNext = veh.nextMaintenanceKm - veh.currentKm;
          const isOverdue = kmToNext <= 0;
          const isNear = kmToNext > 0 && kmToNext <= 2000;

          return (
            <div
              key={veh.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div>
                {/* Header: Plate & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="inline-block px-2 py-0.5 border border-slate-800 rounded bg-slate-900 text-amber-400 font-mono font-bold text-xs tracking-wider">
                      {veh.plate}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {veh.brand} {veh.model}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Ano {veh.year} · {veh.category}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${statusInfo.class}`}>
                      {statusInfo.label}
                    </span>

                    {canManage && (
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() => handleOpenEdit(veh)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Editar Veículo"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(veh.id, veh.plate)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Excluir Veículo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details list */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      Odômetro Atual:
                    </span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {formatKm(veh.currentKm)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" />
                      Combustível:
                    </span>
                    <span className="text-slate-800 font-medium">
                      {veh.fuelType} ({veh.averageConsumptionKmPerL} km/l)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Setor Vinculado:</span>
                    <span className="text-slate-800 font-medium truncate max-w-[150px]">
                      {sector ? sector.name : 'Geral'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Motorista / Operador:</span>
                    <span className="text-slate-800 font-medium truncate max-w-[150px]">
                      {veh.driverName || 'Não fixado'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Maintenance Health Status Bar */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Próxima Revisão:</span>
                  <span className={`font-mono font-bold ${
                    isOverdue ? 'text-rose-600' : isNear ? 'text-amber-700' : 'text-slate-700'
                  }`}>
                    {formatKm(veh.nextMaintenanceKm)}
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  {isOverdue ? (
                    <span className="text-rose-600 font-semibold">⚠️ Revisão VENCIDA em {formatKm(Math.abs(kmToNext))}!</span>
                  ) : isNear ? (
                    <span className="text-amber-700 font-semibold">Faltam apenas {formatKm(kmToNext)} para a revisão</span>
                  ) : (
                    <span>Faltam {formatKm(kmToNext)} para a revisão preventiva</span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedVehicleHistory(veh)}
                  className="w-full mt-1 pt-1 border-t border-slate-200 text-center text-slate-600 hover:text-slate-900 font-medium flex items-center justify-center gap-1 text-[11px]"
                >
                  <Wrench className="w-3 h-3 text-slate-500" />
                  <span>Ver Histórico de OSs</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vehicle Maintenance History Modal Drawer */}
      {selectedVehicleHistory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 border border-slate-800 rounded bg-slate-900 text-amber-400 font-mono font-bold text-xs">
                  {selectedVehicleHistory.plate}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Histórico de Manutenções: {selectedVehicleHistory.brand} {selectedVehicleHistory.model}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Odômetro: {formatKm(selectedVehicleHistory.currentKm)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedVehicleHistory(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs">
              {(() => {
                const vehicleExpenses = expenses.filter((e) => e.vehicleId === selectedVehicleHistory.id);
                if (vehicleExpenses.length === 0) {
                  return (
                    <div className="text-center py-8 text-slate-500">
                      Nenhuma ordem de serviço registrada para este veículo até o momento.
                    </div>
                  );
                }
                return (
                  <div className="divide-y divide-slate-100">
                    {vehicleExpenses.map((exp) => (
                      <div key={exp.id} className="py-3 flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold text-slate-900">
                            {exp.description}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-semibold">{exp.workOrderNumber}</span>
                            <span>·</span>
                            <span>{exp.providerName}</span>
                            <span>·</span>
                            <span>{formatDate(exp.date)}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-slate-900">
                            {exp.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                          <span className="text-[10px] font-mono uppercase text-slate-500">
                            {exp.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedVehicleHistory(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Vehicle Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-900">
                {editingVehicle ? 'Editar Veículo da Frota' : 'Cadastrar Novo Veículo'}
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
                    Placa do Veículo *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    placeholder="Ex: BRA-2E19"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono font-bold uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Marca / Fabricante *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ex: Mercedes-Benz, Scania, VW"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Modelo do Veículo *
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Ex: Actros 2651 6x4"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Ano de Fabricação / Modelo
                  </label>
                  <input
                    type="number"
                    min="1990"
                    max="2030"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Status Operacional
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="active">Operacional / Ativo</option>
                    <option value="in_maintenance">Em Manutenção</option>
                    <option value="standby">Reserva Técnica</option>
                    <option value="inactive">Inativo / Baixado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Quilometragem Atual (KM) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={currentKm}
                    onChange={(e) => setCurrentKm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Próxima Manutenção Preventiva (KM)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={nextMaintenanceKm}
                    onChange={(e) => setNextMaintenanceKm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Setor Vinculado
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
                    Tipo de Combustível
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as Vehicle['fuelType'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="Diesel S10">Diesel S10</option>
                    <option value="Diesel Comum">Diesel Comum</option>
                    <option value="Flex">Flex (Gasolina / Etanol)</option>
                    <option value="Gasolina">Gasolina</option>
                    <option value="Elétrico">Elétrico</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Motorista / Operador Frequente
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Nome do motorista responsável"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Consumo Médio (KM/L)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={averageConsumptionKmPerL}
                    onChange={(e) => setAverageConsumptionKmPerL(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Número do Chassi
                  </label>
                  <input
                    type="text"
                    value={chassis}
                    onChange={(e) => setChassis(e.target.value.toUpperCase())}
                    placeholder="17 dígitos do chassi"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Código RENAVAM
                  </label>
                  <input
                    type="text"
                    value={renavam}
                    onChange={(e) => setRenavam(e.target.value)}
                    placeholder="11 dígitos"
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
                  <span>{editingVehicle ? 'Salvar Veículo' : 'Cadastrar Veículo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
