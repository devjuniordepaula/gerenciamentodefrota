import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { MaintenancePlan, PlanType, PlanItem } from '../types/fleet';
import { formatCurrency, formatKm } from '../utils/formatters';
import {
  Wrench,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Gauge,
  ListChecks,
  X,
  Check,
  PlusCircle,
} from 'lucide-react';

const PLAN_TYPE_LABELS: Record<PlanType, { label: string; class: string }> = {
  preventiva: { label: 'Preventiva Periódica', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  preditiva: { label: 'Preditiva / Diagnóstico', class: 'bg-blue-50 text-blue-800 border-blue-200' },
  corretiva: { label: 'Corretiva Programada', class: 'bg-amber-50 text-amber-900 border-amber-200' },
  revisao_obrigatoria: { label: 'Revisão Concessionária', class: 'bg-purple-50 text-purple-800 border-purple-200' },
};

export const MaintenancePlansView: React.FC = () => {
  const { maintenancePlans, vehicles, addMaintenancePlan, updateMaintenancePlan, deleteMaintenancePlan, currentUser } = useFleet();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MaintenancePlan | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PlanType>('preventiva');
  const [frequencyType, setFrequencyType] = useState<MaintenancePlan['frequencyType']>('km');
  const [intervalKm, setIntervalKm] = useState<number>(10000);
  const [intervalDays, setIntervalDays] = useState<number>(90);
  const [targetCategory, setTargetCategory] = useState('Caminhão Pesado');
  const [targetVehicleIds, setTargetVehicleIds] = useState<string[]>([]);
  const [estimatedCost, setEstimatedCost] = useState<number>(2500);
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  // Checklist items in modal
  const [items, setItems] = useState<PlanItem[]>([
    { id: '1', name: 'Troca de Óleo Lubrificante do Motor', category: 'fluidos', required: true },
    { id: '2', name: 'Substituição Filtro de Óleo e Combustível', category: 'motor', required: true },
    { id: '3', name: 'Inspeção de Lonas e Pastilhas de Freio', category: 'freios', required: true },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PlanItem['category']>('geral');

  const canManage = currentUser.permissions.canManagePlans || currentUser.role === 'admin';

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setTitle('');
    setType('preventiva');
    setFrequencyType('km');
    setIntervalKm(10000);
    setIntervalDays(90);
    setTargetCategory('Caminhão Pesado');
    setTargetVehicleIds(vehicles.slice(0, 3).map((v) => v.id));
    setEstimatedCost(2500);
    setDescription('');
    setActive(true);
    setItems([
      { id: '1', name: 'Troca de Óleo Lubrificante do Motor', category: 'fluidos', required: true },
      { id: '2', name: 'Substituição Filtro de Óleo e Combustível', category: 'motor', required: true },
      { id: '3', name: 'Inspeção de Lonas e Pastilhas de Freio', category: 'freios', required: true },
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: MaintenancePlan) => {
    setEditingPlan(plan);
    setTitle(plan.title);
    setType(plan.type);
    setFrequencyType(plan.frequencyType);
    setIntervalKm(plan.intervalKm);
    setIntervalDays(plan.intervalDays);
    setTargetCategory(plan.targetCategory);
    setTargetVehicleIds(plan.targetVehicleIds || []);
    setEstimatedCost(plan.estimatedCost);
    setDescription(plan.description);
    setActive(plan.active);
    setItems(plan.items || []);
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        name: newItemName.trim(),
        category: newItemCategory,
        required: true,
      },
    ]);
    setNewItemName('');
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingPlan) {
      updateMaintenancePlan(editingPlan.id, {
        title,
        type,
        frequencyType,
        intervalKm: Number(intervalKm),
        intervalDays: Number(intervalDays),
        targetCategory,
        targetVehicleIds,
        items,
        estimatedCost: Number(estimatedCost),
        active,
        description,
      });
    } else {
      addMaintenancePlan({
        title,
        type,
        frequencyType,
        intervalKm: Number(intervalKm),
        intervalDays: Number(intervalDays),
        targetCategory,
        targetVehicleIds,
        items,
        estimatedCost: Number(estimatedCost),
        active,
        description,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, pTitle: string) => {
    if (confirm(`Deseja realmente remover o plano de manutenção "${pTitle}"?`)) {
      deleteMaintenancePlan(id);
    }
  };

  const filteredPlans = maintenancePlans.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Planos de Manutenção Preventiva & Preditiva
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Padronize rotinas de inspeção, checklists de revisão por quilometragem e periodicidade temporal.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Plano de Manutenção</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome do plano ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 font-medium"
        >
          <option value="all">Todos os Tipos de Plano</option>
          <option value="preventiva">Preventiva Periódica</option>
          <option value="preditiva">Preditiva / Diagnóstico</option>
          <option value="corretiva">Corretiva Programada</option>
          <option value="revisao_obrigatoria">Revisão Concessionária</option>
        </select>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPlans.map((plan) => {
          const typeBadge = PLAN_TYPE_LABELS[plan.type] || PLAN_TYPE_LABELS.preventiva;
          const coveredVehiclesCount = plan.targetVehicleIds?.length || 0;

          return (
            <div
              key={plan.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${typeBadge.class}`}>
                      {typeBadge.label}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {plan.title}
                    </h3>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(plan)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        title="Editar Plano"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id, plan.title)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Excluir Plano"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-2">
                  {plan.description}
                </p>

                {/* Periodicity Badges */}
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono">
                  {plan.frequencyType !== 'days' && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded text-slate-700">
                      <Gauge className="w-3.5 h-3.5 text-slate-500" />
                      <span>A cada <strong>{formatKm(plan.intervalKm)}</strong></span>
                    </div>
                  )}

                  {plan.frequencyType !== 'km' && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ou a cada <strong>{plan.intervalDays} dias</strong></span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded text-slate-700">
                    <span>Custo Estimado: <strong>{formatCurrency(plan.estimatedCost)}</strong></span>
                  </div>
                </div>

                {/* Checklist Preview */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
                    <span className="flex items-center gap-1.5">
                      <ListChecks className="w-4 h-4 text-slate-500" />
                      Checklist de Itens ({plan.items?.length || 0}):
                    </span>
                    <span className="text-[11px] font-normal text-slate-500">
                      Categoria: {plan.targetCategory}
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600 max-h-36 overflow-y-auto pr-1">
                    {plan.items?.map((item) => (
                      <li key={item.id} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom footer status */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{coveredVehiclesCount} veículo(s) vinculados diretamente</span>
                <span className={`font-medium ${plan.active ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {plan.active ? '● Plano Ativo' : '○ Inativo'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-900">
                {editingPlan ? 'Editar Plano de Manutenção' : 'Criar Plano de Manutenção'}
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
                    Título do Plano *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Revisão Preventiva Ouro 10.000 KM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Tipo de Manutenção
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PlanType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="preventiva">Preventiva Periódica</option>
                    <option value="preditiva">Preditiva / Diagnóstico</option>
                    <option value="corretiva">Corretiva Programada</option>
                    <option value="revisao_obrigatoria">Revisão Concessionária</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Categoria Alvo
                  </label>
                  <select
                    value={targetCategory}
                    onChange={(e) => setTargetCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="Todos">Todos os Veículos</option>
                    <option value="Caminhão Pesado">Caminhão Pesado</option>
                    <option value="Caminhão Médio">Caminhão Médio</option>
                    <option value="Van de Carga">Van de Carga</option>
                    <option value="Utilitário">Utilitário</option>
                    <option value="Passeio">Passeio</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Regra de Disparo
                  </label>
                  <select
                    value={frequencyType}
                    onChange={(e) => setFrequencyType(e.target.value as MaintenancePlan['frequencyType'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="km">Por Quilometragem (KM)</option>
                    <option value="days">Por Intervalo de Dias</option>
                    <option value="hybrid">Híbrido (KM ou Dias - o que ocorrer primeiro)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Custo Médio Estimado (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                {frequencyType !== 'days' && (
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Intervalo em KM *
                    </label>
                    <input
                      type="number"
                      min="1000"
                      step="1000"
                      value={intervalKm}
                      onChange={(e) => setIntervalKm(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                    />
                  </div>
                )}

                {frequencyType !== 'km' && (
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Intervalo em Dias
                    </label>
                    <input
                      type="number"
                      min="15"
                      value={intervalDays}
                      onChange={(e) => setIntervalDays(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Descrição Detalhada do Plano
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Instruções operacionais e recomendações do fabricante..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Checklist management in modal */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <label className="block font-bold text-slate-900">
                  Itens de Verificação / Checklist do Plano
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Nome do item (ex: Troca de filtro secador de ar)"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as PlanItem['category'])}
                    className="px-2 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="motor">Motor</option>
                    <option value="freios">Freios</option>
                    <option value="fluidos">Fluidos/Óleo</option>
                    <option value="suspensao">Suspensão</option>
                    <option value="pneus">Pneus</option>
                    <option value="eletrica">Elétrica</option>
                    <option value="geral">Geral</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 bg-slate-50 rounded-md p-2 border border-slate-200">
                  {items.map((it) => (
                    <div key={it.id} className="py-1.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-slate-800">{it.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">[{it.category}]</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
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
                  <span>{editingPlan ? 'Salvar Plano' : 'Criar Plano'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
