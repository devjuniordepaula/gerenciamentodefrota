import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { Warranty, WarrantyStatus } from '../types/fleet';
import { formatCurrency, formatKm, formatDate } from '../utils/formatters';
import {
  ShieldAlert,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCheck,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';

const STATUS_CONFIG: Record<WarrantyStatus, { label: string; class: string; icon: any }> = {
  vigente: { label: 'Garantia Vigente', class: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
  vencendo: { label: 'Vencendo em Breve', class: 'bg-amber-50 text-amber-900 border-amber-200', icon: AlertTriangle },
  expirada: { label: 'Garantia Expirada', class: 'bg-slate-100 text-slate-600 border-slate-200', icon: Clock },
  acionada: { label: 'Garantia Acionada / Sinistro', class: 'bg-purple-50 text-purple-900 border-purple-200', icon: RotateCcw },
};

export const WarrantiesView: React.FC = () => {
  const { warranties, vehicles, accreditedProviders, addWarranty, updateWarranty, deleteWarranty, claimWarranty, currentUser } = useFleet();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);

  // Claim warranty modal state
  const [claimingWarranty, setClaimingWarranty] = useState<Warranty | null>(null);
  const [claimNotes, setClaimNotes] = useState('');

  // Form State
  const [partOrService, setPartOrService] = useState('');
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [providerId, setProviderId] = useState(accreditedProviders[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [workOrderNumber, setWorkOrderNumber] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [coverageKm, setCoverageKm] = useState<number>(50000);
  const [startKm, setStartKm] = useState<number>(0);
  const [status, setStatus] = useState<WarrantyStatus>('vigente');
  const [valueCovered, setValueCovered] = useState<number>(3000);

  const canManage = currentUser.permissions.canManageWarranties || currentUser.role === 'admin';

  // Metrics summary
  const totalValueActive = warranties
    .filter((w) => w.status === 'vigente' || w.status === 'vencendo')
    .reduce((acc, w) => acc + w.valueCovered, 0);

  const expiringCount = warranties.filter((w) => w.status === 'vencendo').length;
  const claimedCount = warranties.filter((w) => w.status === 'acionada').length;

  const handleOpenCreate = () => {
    setEditingWarranty(null);
    setPartOrService('');
    const defaultVeh = vehicles[0];
    setVehicleId(defaultVeh?.id || '');
    setStartKm(defaultVeh?.currentKm || 0);
    setProviderId(accreditedProviders[0]?.id || '');
    setInvoiceNumber(`NF-e 0${Math.floor(Math.random() * 89999 + 10000)}`);
    setWorkOrderNumber(`OS-2026-${Math.floor(Math.random() * 899 + 100)}`);
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    // 1 year forward
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setEndDate(nextYear.toISOString().split('T')[0]);
    setCoverageKm(50000);
    setStatus('vigente');
    setValueCovered(3500);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w: Warranty) => {
    setEditingWarranty(w);
    setPartOrService(w.partOrService);
    setVehicleId(w.vehicleId);
    setProviderId(w.providerId);
    setInvoiceNumber(w.invoiceNumber);
    setWorkOrderNumber(w.workOrderNumber);
    setStartDate(w.startDate);
    setEndDate(w.endDate);
    setCoverageKm(w.coverageKm || 0);
    setStartKm(w.startKm || 0);
    setStatus(w.status);
    setValueCovered(w.valueCovered);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partOrService.trim()) return;

    const selVeh = vehicles.find((v) => v.id === vehicleId);
    const selProv = accreditedProviders.find((p) => p.id === providerId);

    const vehiclePlate = selVeh ? selVeh.plate : 'FROTA';
    const providerName = selProv ? selProv.name : 'Fornecedor Credenciado';

    if (editingWarranty) {
      updateWarranty(editingWarranty.id, {
        partOrService,
        vehicleId,
        vehiclePlate,
        providerId,
        providerName,
        invoiceNumber,
        workOrderNumber,
        startDate,
        endDate,
        coverageKm: Number(coverageKm),
        startKm: Number(startKm),
        status,
        valueCovered: Number(valueCovered),
      });
    } else {
      addWarranty({
        partOrService,
        vehicleId,
        vehiclePlate,
        providerId,
        providerName,
        invoiceNumber,
        workOrderNumber,
        startDate,
        endDate,
        coverageKm: Number(coverageKm),
        startKm: Number(startKm),
        status,
        valueCovered: Number(valueCovered),
      });
    }
    setIsModalOpen(false);
  };

  const handleConfirmClaim = () => {
    if (!claimingWarranty || !claimNotes.trim()) return;
    claimWarranty(claimingWarranty.id, claimNotes);
    setClaimingWarranty(null);
    setClaimNotes('');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja remover o registro de garantia de "${name}"?`)) {
      deleteWarranty(id);
    }
  };

  const filteredWarranties = warranties.filter((w) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      w.partOrService.toLowerCase().includes(q) ||
      w.vehiclePlate.toLowerCase().includes(q) ||
      w.providerName.toLowerCase().includes(q) ||
      w.invoiceNumber.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Controle de Garantias de Peças & Serviços
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhe prazos legais e contratuais, quilometragens limite e acione garantias sem custos adicionais.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Garantia</span>
          </button>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Patrimônio em Garantia Ativa</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatCurrency(totalValueActive)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Peças e serviços vigentes na frota
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Garantias a Expirar (&lt;30d)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-800 mt-1 tabular-nums">
            {expiringCount} itens
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Requer inspeção antes do vencimento
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Garantias Acionadas</span>
            <RotateCcw className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-900 mt-1 tabular-nums">
            {claimedCount} sinistros atendidos
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Custo zero para a empresa
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por peça, placa, oficina credenciada ou NF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 font-medium"
        >
          <option value="all">Todos os Status</option>
          <option value="vigente">Garantia Vigente</option>
          <option value="vencendo">Vencendo em Breve</option>
          <option value="acionada">Acionada / Sinistro</option>
          <option value="expirada">Expirada</option>
        </select>
      </div>

      {/* Warranties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWarranties.map((war) => {
          const cfg = STATUS_CONFIG[war.status] || STATUS_CONFIG.vigente;
          const Icon = cfg.icon;

          return (
            <div
              key={war.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${cfg.class}`}>
                      <Icon className="w-3 h-3" />
                      <span>{cfg.label}</span>
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {war.partOrService}
                    </h3>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(war)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        title="Editar Garantia"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(war.id, war.partOrService)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Excluir Garantia"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Veículo / Placa:</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                      {war.vehiclePlate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Credenciado:</span>
                    <span className="text-slate-800 font-medium truncate max-w-[160px]" title={war.providerName}>
                      {war.providerName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 font-mono">
                    <span>NF-e / OS:</span>
                    <span className="text-slate-700">
                      {war.invoiceNumber} ({war.workOrderNumber})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 font-mono">
                    <span>Vigência:</span>
                    <span className="text-slate-800">
                      {formatDate(war.startDate)} até {formatDate(war.endDate)}
                    </span>
                  </div>

                  {war.coverageKm ? (
                    <div className="flex items-center justify-between text-slate-600 font-mono">
                      <span>Limite de KM:</span>
                      <span className="text-slate-800">
                        {formatKm(war.coverageKm)} (Início: {formatKm(war.startKm || 0)})
                      </span>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Valor Assegurado:</span>
                    <span className="font-mono font-bold text-emerald-800 tabular-nums">
                      {formatCurrency(war.valueCovered)}
                    </span>
                  </div>

                  {war.status === 'acionada' && war.claimNotes && (
                    <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-100 text-[11px] text-purple-900">
                      <strong>Sinistro Acionado em {formatDate(war.claimedAt || '')}:</strong> {war.claimNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {war.status !== 'acionada' && war.status !== 'expirada' && canManage && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setClaimingWarranty(war);
                      setClaimNotes('');
                    }}
                    className="w-full py-1.5 px-3 bg-slate-100 hover:bg-purple-100 hover:text-purple-900 text-slate-700 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Acionar Garantia Junto à Oficina</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Claim Warranty Modal */}
      {claimingWarranty && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-purple-50">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Acionar Garantia de Peça / Reparo
                </h3>
              </div>
              <button
                onClick={() => setClaimingWarranty(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div><strong>Item:</strong> {claimingWarranty.partOrService}</div>
                <div><strong>Veículo:</strong> {claimingWarranty.vehiclePlate}</div>
                <div><strong>Credenciado:</strong> {claimingWarranty.providerName}</div>
                <div><strong>NF / OS:</strong> {claimingWarranty.invoiceNumber} / {claimingWarranty.workOrderNumber}</div>
                <div><strong>Valor Coberto:</strong> {formatCurrency(claimingWarranty.valueCovered)}</div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Motivo da Falha / Relato do Motorista e Diagnóstico *
                </label>
                <textarea
                  rows={3}
                  required
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  placeholder="Ex: Folga excessiva no conjunto turbocompressor após 20.000km, perda de potência na rodovia. Veículo direcionado à concessionária para substituição em garantia."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setClaimingWarranty(null)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClaim}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirmar Acionamento</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Warranty Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-900">
                {editingWarranty ? 'Editar Garantia' : 'Cadastrar Nova Garantia'}
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
                    Peça ou Serviço Assegurado *
                  </label>
                  <input
                    type="text"
                    required
                    value={partOrService}
                    onChange={(e) => setPartOrService(e.target.value)}
                    placeholder="Ex: Conjunto Turbocompressor BorgWarner K27"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Veículo da Frota *
                  </label>
                  <select
                    value={vehicleId}
                    onChange={(e) => {
                      setVehicleId(e.target.value);
                      const veh = vehicles.find((v) => v.id === e.target.value);
                      if (veh) setStartKm(veh.currentKm);
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
                    Oficina / Credenciado Fornecedor *
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
                    Número da Nota Fiscal (NF-e)
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="NF-e 049.201"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Número da OS Interna
                  </label>
                  <input
                    type="text"
                    required
                    value={workOrderNumber}
                    onChange={(e) => setWorkOrderNumber(e.target.value)}
                    placeholder="OS-2026-081"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Data de Início da Garantia *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Data de Término da Garantia *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Limite de KM Coberto (0 se ilimitado)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={coverageKm}
                    onChange={(e) => setCoverageKm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    KM no Momento da Instalação
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={startKm}
                    onChange={(e) => setStartKm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Valor Assegurado da Peça/Serviço (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={valueCovered}
                    onChange={(e) => setValueCovered(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Status Inicial
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as WarrantyStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="vigente">Garantia Vigente</option>
                    <option value="vencendo">Vencendo em Breve</option>
                    <option value="acionada">Acionada / Sinistro</option>
                    <option value="expirada">Expirada</option>
                  </select>
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
                  <span>{editingWarranty ? 'Salvar Alterações' : 'Cadastrar Garantia'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
