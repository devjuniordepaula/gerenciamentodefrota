import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { PartComparison, PartQuote } from '../types/fleet';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Scale,
  Plus,
  Search,
  CheckCircle2,
  TrendingDown,
  Clock,
  Star,
  Shield,
  Truck,
  Building2,
  Trash2,
  PlusCircle,
  X,
  Check,
  Award,
} from 'lucide-react';

export const PriceComparisonView: React.FC = () => {
  const { partComparisons, accreditedProviders, addPartComparison, deletePartComparison, addQuoteToPart } = useFleet();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartId, setSelectedPartId] = useState<string>(partComparisons[0]?.id || '');
  const [isNewPartModalOpen, setIsNewPartModalOpen] = useState(false);
  const [isAddQuoteModalOpen, setIsAddQuoteModalOpen] = useState(false);

  // New Part Form
  const [partCode, setPartCode] = useState('');
  const [partName, setPartName] = useState('');
  const [partCategory, setPartCategory] = useState('Freios & Suspensão');
  const [compatibleModels, setCompatibleModels] = useState('');

  // New Quote Form
  const [quoteProviderId, setQuoteProviderId] = useState(accreditedProviders[0]?.id || '');
  const [quotePrice, setQuotePrice] = useState<number>(500);
  const [quoteBrand, setQuoteBrand] = useState('');
  const [quoteWarrantyMonths, setQuoteWarrantyMonths] = useState<number>(12);
  const [quoteAvailabilityDays, setQuoteAvailabilityDays] = useState<number>(0);
  const [quoteDeliveryIncluded, setQuoteDeliveryIncluded] = useState(true);

  const selectedPart = partComparisons.find((p) => p.id === selectedPartId) || partComparisons[0];

  // Calculations for selected part
  const quotes = selectedPart?.quotes || [];
  const prices = quotes.map((q) => q.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const potentialSavings = maxPrice > 0 ? maxPrice - minPrice : 0;
  const savingsPercent = maxPrice > 0 ? ((maxPrice - minPrice) / maxPrice) * 100 : 0;

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName.trim()) return;

    addPartComparison({
      partCode: partCode.trim() || `PART-${Math.floor(Math.random() * 899 + 100)}`,
      name: partName,
      category: partCategory,
      compatibleModels: compatibleModels.split(',').map((s) => s.trim()).filter(Boolean),
      quotes: [],
    });

    setIsNewPartModalOpen(false);
    setPartName('');
    setPartCode('');
    setCompatibleModels('');
  };

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPart) return;

    const provider = accreditedProviders.find((p) => p.id === quoteProviderId);
    const providerName = provider ? provider.name : 'Oficina Credenciada';

    const newQuote: PartQuote = {
      providerId: quoteProviderId,
      providerName,
      price: Number(quotePrice),
      brand: quoteBrand || 'Original Homologada',
      warrantyMonths: Number(quoteWarrantyMonths),
      availabilityDays: Number(quoteAvailabilityDays),
      deliveryIncluded: quoteDeliveryIncluded,
      rating: provider ? provider.rating : 4.8,
    };

    addQuoteToPart(selectedPart.id, newQuote);
    setIsAddQuoteModalOpen(false);
    setQuotePrice(500);
    setQuoteBrand('');
  };

  const filteredParts = partComparisons.filter((p) => {
    const q = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.partCode.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Comparativo de Preços entre Peças & Cotações de Credenciados
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analise variações de preço de peças homologadas, descubra a menor cotação e calcule economias imediatas.
          </p>
        </div>

        <button
          onClick={() => setIsNewPartModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Peça para Comparação</span>
        </button>
      </div>

      {/* Main Grid: Left selector & Right Benchmark detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Part List */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar peça ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px] pr-1">
            {filteredParts.map((part) => {
              const isSelected = part.id === selectedPart?.id;
              const pQuotes = part.quotes || [];
              const minP = pQuotes.length ? Math.min(...pQuotes.map((q) => q.price)) : 0;

              return (
                <button
                  key={part.id}
                  onClick={() => setSelectedPartId(part.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors my-1 ${
                    isSelected
                      ? 'bg-amber-50/70 border border-amber-300'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wide">
                      {part.partCode}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {pQuotes.length} cotações
                    </span>
                  </div>

                  <div className="font-semibold text-xs text-slate-900 line-clamp-1 mt-0.5">
                    {part.name}
                  </div>

                  <div className="flex items-center justify-between text-[11px] mt-2 font-mono">
                    <span className="text-slate-500">{part.category}</span>
                    <span className="font-bold text-slate-900">
                      {minP > 0 ? `a partir de ${formatCurrency(minP)}` : 'Sem cotações'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Benchmark & Quotes Matrix */}
        <div className="lg:col-span-2 space-y-5">
          {selectedPart ? (
            <>
              {/* Part Header & KPI bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        {selectedPart.partCode}
                      </span>
                      <span className="text-xs text-slate-500">· {selectedPart.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {selectedPart.name}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Modelos compatíveis: {selectedPart.compatibleModels.join(', ') || 'Universal'}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAddQuoteModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors self-start"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Adicionar Cotação</span>
                  </button>
                </div>

                {/* 4 Financial Benchmarking Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center justify-between text-emerald-800 text-[11px] font-medium">
                      <span>Menor Preço</span>
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-lg font-bold font-mono text-emerald-950 mt-1 tabular-nums">
                      {formatCurrency(minPrice)}
                    </div>
                    <div className="text-[10px] text-emerald-800 mt-0.5 font-medium">
                      Melhor negócio
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
                      <span>Preço Médio</span>
                      <Scale className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                      {formatCurrency(avgPrice)}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Média do mercado
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
                      <span>Maior Preço</span>
                      <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                    </div>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                      {formatCurrency(maxPrice)}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Cotação máxima
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200">
                    <div className="flex items-center justify-between text-amber-800 text-[11px] font-medium">
                      <span>Economia Possível</span>
                      <span className="font-mono font-bold text-amber-900">{savingsPercent.toFixed(0)}%</span>
                    </div>
                    <div className="text-lg font-bold font-mono text-amber-950 mt-1 tabular-nums">
                      {formatCurrency(potentialSavings)}
                    </div>
                    <div className="text-[10px] text-amber-800 mt-0.5 font-medium">
                      Por unidade adquirida
                    </div>
                  </div>
                </div>
              </div>

              {/* Quotes Ranking List */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">
                    Ranking de Oficinas & Distribuidores ({quotes.length})
                  </h4>
                  <span className="text-xs text-slate-500">
                    Ordenado do menor para o maior preço
                  </span>
                </div>

                <div className="space-y-3">
                  {quotes
                    .slice()
                    .sort((a, b) => a.price - b.price)
                    .map((q, idx) => {
                      const isBestPrice = q.price === minPrice;
                      const diffFromMin = q.price - minPrice;
                      const percentBar = maxPrice > 0 ? (q.price / maxPrice) * 100 : 100;

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border transition-all ${
                            isBestPrice
                              ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-300'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  isBestPrice ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  #{idx + 1}
                                </span>
                                <h5 className="font-bold text-slate-900 text-sm">
                                  {q.providerName}
                                </h5>
                                {isBestPrice && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold uppercase">
                                    Melhor Preço
                                  </span>
                                )}
                              </div>

                              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2.5">
                                <span>Marca: <strong className="text-slate-800">{q.brand}</strong></span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                                  {q.warrantyMonths} meses de garantia
                                </span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  {q.availabilityDays === 0 ? 'Pronta Entrega' : `${q.availabilityDays} dias úteis`}
                                </span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                  {q.rating}
                                </span>
                              </div>
                            </div>

                            <div className="text-left sm:text-right">
                              <div className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                                {formatCurrency(q.price)}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500">
                                {isBestPrice ? (
                                  <span className="text-emerald-700 font-semibold">Oferta mais econômica</span>
                                ) : (
                                  <span className="text-rose-600">+{formatCurrency(diffFromMin)} vs menor</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Relative Price Bar */}
                          <div className="mt-3">
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${isBestPrice ? 'bg-emerald-500' : 'bg-slate-400'}`}
                                style={{ width: `${percentBar}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {quotes.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      Nenhuma cotação cadastrada para esta peça ainda. Clique em &quot;Adicionar Cotação&quot; acima.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">
              Selecione uma peça ao lado para visualizar a análise comparativa de preços.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add New Part */}
      {isNewPartModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Cadastrar Peça para Comparação de Mercado
              </h3>
              <button onClick={() => setIsNewPartModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePart} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Código da Peça / Part Number (SKU)
                </label>
                <input
                  type="text"
                  value={partCode}
                  onChange={(e) => setPartCode(e.target.value.toUpperCase())}
                  placeholder="Ex: PNEU-295-80-R22 ou COB-5542"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nome / Descrição da Peça *
                </label>
                <input
                  type="text"
                  required
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  placeholder="Ex: Pastilhas de Freio Eixo Dianteiro Pesado"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Categoria
                </label>
                <select
                  value={partCategory}
                  onChange={(e) => setPartCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                >
                  <option value="Freios & Segurança">Freios & Segurança</option>
                  <option value="Pneumáticos">Pneumáticos & Rodas</option>
                  <option value="Filtros & Motor">Filtros & Motor</option>
                  <option value="Elétrica & Baterias">Elétrica & Baterias</option>
                  <option value="Fluidos & Lubrificantes">Fluidos & Lubrificantes</option>
                  <option value="Suspensão & Direção">Suspensão & Direção</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Modelos de Veículos Compatíveis (separados por vírgula)
                </label>
                <input
                  type="text"
                  value={compatibleModels}
                  onChange={(e) => setCompatibleModels(e.target.value)}
                  placeholder="Ex: Actros 2651, Scania R450, Volvo FH 540"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPartModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Cadastrar Peça</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Quote to Selected Part */}
      {isAddQuoteModalOpen && selectedPart && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Adicionar Cotação de Fornecedor
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedPart.name} ({selectedPart.partCode})
                </p>
              </div>
              <button onClick={() => setIsAddQuoteModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuote} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Oficina Credenciada / Fornecedor *
                </label>
                <select
                  value={quoteProviderId}
                  onChange={(e) => setQuoteProviderId(e.target.value)}
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
                  Preço Cotado Unitário (R$) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Marca do Fabricante / Linha
                </label>
                <input
                  type="text"
                  required
                  value={quoteBrand}
                  onChange={(e) => setQuoteBrand(e.target.value)}
                  placeholder="Ex: Fras-le Premium ou Bosch Heavy Duty"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Garantia (Meses)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quoteWarrantyMonths}
                    onChange={(e) => setQuoteWarrantyMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Prazo de Entrega (Dias)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quoteAvailabilityDays}
                    onChange={(e) => setQuoteAvailabilityDays(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">0 = Pronta entrega</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-800">
                  <input
                    type="checkbox"
                    checked={quoteDeliveryIncluded}
                    onChange={(e) => setQuoteDeliveryIncluded(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                  />
                  <span>Frete e entrega inclusos na garagem da empresa</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddQuoteModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Cotação</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
