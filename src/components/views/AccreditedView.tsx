import React, { useState } from 'react';
import { useFleet } from '../../app/context/FleetContext'
import { AccreditedProvider } from '../../app/types/fleet';
import { formatCurrency } from '../utils/formatters';
import {
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Clock,
  Star,
  Award,
  Navigation,
  Wrench,
  Building2,
  CheckCircle2,
  X,
  Check,
  ShieldCheck,
} from 'lucide-react';

export const AccreditedView: React.FC = () => {
  const { accreditedProviders, addProvider, updateProvider, deleteProvider, currentUser } = useFleet();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState<string>(accreditedProviders[0]?.id || '');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AccreditedProvider | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [zipCode, setZipCode] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(180);
  const [openingHours, setOpeningHours] = useState('Segunda a Sexta: 08:00 - 18:00');
  const [rating, setRating] = useState<number>(4.8);
  const [nps, setNps] = useState<number>(85);
  const [servicesInput, setServicesInput] = useState('Freios, Troca de Óleo, Suspensão');

  const canManage = currentUser.permissions.canManageAccredited || currentUser.role === 'admin';

  const selectedProvider = accreditedProviders.find((p) => p.id === selectedProviderId) || accreditedProviders[0];

  const handleOpenCreate = () => {
    setEditingProvider(null);
    setName('');
    setTradeName('');
    setCnpj('12.345.678/0001-90');
    setPhone('(11) 3322-1100');
    setEmail('contato@oficinacredenciada.com.br');
    setContactPerson('Chefe de Manutenção');
    setStreet('Av. das Indústrias');
    setNumber('500');
    setNeighborhood('Distrito Industrial');
    setCity('São Paulo');
    setState('SP');
    setZipCode('01000-000');
    setHourlyRate(180);
    setOpeningHours('Segunda a Sexta: 07:30 - 18:00 | Sábado: 08:00 - 12:00');
    setRating(4.8);
    setNps(85);
    setServicesInput('Mecânica Diesel, Freios Pneumáticos, Injeção Eletrônica, Troca de Lubrificantes');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: AccreditedProvider) => {
    setEditingProvider(p);
    setName(p.name);
    setTradeName(p.tradeName);
    setCnpj(p.cnpj);
    setPhone(p.phone);
    setEmail(p.email);
    setContactPerson(p.contactPerson);
    setStreet(p.street);
    setNumber(p.number);
    setNeighborhood(p.neighborhood);
    setCity(p.city);
    setState(p.state);
    setZipCode(p.zipCode);
    setHourlyRate(p.hourlyRate);
    setOpeningHours(p.openingHours);
    setRating(p.rating);
    setNps(p.nps);
    setServicesInput(p.services.join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const services = servicesInput.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingProvider) {
      updateProvider(editingProvider.id, {
        name,
        tradeName,
        cnpj,
        phone,
        email,
        contactPerson,
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
        hourlyRate: Number(hourlyRate),
        openingHours,
        rating: Number(rating),
        nps: Number(nps),
        services,
      });
    } else {
      addProvider({
        name,
        tradeName,
        cnpj,
        phone,
        email,
        contactPerson,
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
        lat: -23.5505 + (Math.random() - 0.5) * 0.15,
        lng: -46.6333 + (Math.random() - 0.5) * 0.15,
        services,
        rating: Number(rating),
        nps: Number(nps),
        totalServicesDone: 0,
        hourlyRate: Number(hourlyRate),
        openingHours,
        status: 'ativo',
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, pName: string) => {
    if (confirm(`Deseja realmente remover o credenciado "${pName}"?`)) {
      deleteProvider(id);
    }
  };

  const filteredProviders = accreditedProviders.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.tradeName.toLowerCase().includes(q) ||
      p.cnpj.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.services.some((s) => s.toLowerCase().includes(q));

    const matchesService = serviceFilter === 'all' || p.services.some((s) => s.toLowerCase().includes(serviceFilter.toLowerCase()));

    return matchesSearch && matchesService;
  });

  // Calculate NPS classification
  const getNpsBadge = (score: number) => {
    if (score >= 75) {
      return { label: 'Zona de Excelência', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
    if (score >= 50) {
      return { label: 'Zona de Qualidade', class: 'bg-blue-50 text-blue-800 border-blue-200' };
    }
    return { label: 'Zona de Aperfeiçoamento', class: 'bg-amber-50 text-amber-900 border-amber-200' };
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Rede de Oficinas & Credenciados Homologados
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Localize fornecedores credenciados no mapa interativo, consulte NPS, especialidades e tabela de mão de obra.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Homologar Novo Credenciado</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ, cidade, especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 font-medium"
        >
          <option value="all">Todas as Especialidades</option>
          <option value="freio">Freios & Pastilhas</option>
          <option value="óleo">Óleos & Fluidos</option>
          <option value="pneu">Pneus & Geometria</option>
          <option value="injeção">Injeção Eletrônica</option>
          <option value="câmbio">Câmbios & Transmissão</option>
          <option value="bateria">Elétrica & Baterias</option>
          <option value="funilaria">Funilaria & Pintura</option>
        </select>
      </div>

      {/* Two-Column Layout: Left Directory List & Right Interactive Map + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Accredited Providers List */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span>Credenciados Homologados</span>
            <span className="font-mono font-bold text-slate-800">{filteredProviders.length}</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[620px] pr-1 space-y-1">
            {filteredProviders.map((p) => {
              const isSelected = p.id === selectedProvider?.id;
              const npsBadge = getNpsBadge(p.nps);

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProviderId(p.id)}
                  className={`p-3 rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/70 border border-amber-300'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                        {p.tradeName || p.name}
                      </h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{p.city} - {p.state}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-0.5 text-xs font-bold text-slate-900">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{p.rating}</span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-800 font-bold">
                        NPS {p.nps}
                      </div>
                    </div>
                  </div>

                  {/* Services snippet */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.services.slice(0, 2).map((srv, idx) => (
                      <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {srv}
                      </span>
                    ))}
                    {p.services.length > 2 && (
                      <span className="text-[9px] text-slate-400">+{p.services.length - 2}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Map & Comprehensive Identification Card */}
        <div className="lg:col-span-2 space-y-5">
          {/* HIGH-FIDELITY VECTOR MAP VIEWPORT */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs relative">
            {/* Map Top Bar */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-xs border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 pointer-events-auto flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Mapa Georreferenciado de Oficinas Credenciadas</span>
              </div>
              <div className="bg-slate-900/90 backdrop-blur-xs border border-slate-700 rounded-lg px-2.5 py-1 text-[11px] font-mono text-amber-400 pointer-events-auto">
                {accreditedProviders.length} Pontos Ativos
              </div>
            </div>

            {/* Custom Interactive SVG/Canvas Geo Simulation representing São Paulo / SP Metro area */}
            <div className="h-[280px] w-full relative bg-slate-950 overflow-hidden flex items-center justify-center">
              {/* Map grid lines background */}
              <svg className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.7" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Simulated highways / arterial rings */}
                <path d="M 20 180 Q 200 120 400 160 T 700 140" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M 120 20 Q 300 100 500 240" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                <path d="M 50 100 Q 250 200 650 180" fill="none" stroke="#94a3b8" strokeWidth="1" />
              </svg>

              {/* Pin markers for accredited providers */}
              {accreditedProviders.map((p, idx) => {
                const isSelected = p.id === selectedProvider?.id;
                // Deterministic visual coordinates on map surface
                const xOffsets = [25, 45, 65, 80, 35, 55, 75];
                const yOffsets = [45, 60, 35, 70, 75, 40, 50];
                const left = `${xOffsets[idx % xOffsets.length]}%`;
                const top = `${yOffsets[idx % yOffsets.length]}%`;

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProviderId(p.id)}
                    style={{ left, top }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-colors border-2 ${
                          isSelected
                            ? 'bg-amber-500 border-white text-slate-950 font-bold'
                            : 'bg-slate-800 border-amber-400 text-amber-400'
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <div
                        className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap transition-opacity ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 opacity-100'
                            : 'bg-slate-900/90 text-white opacity-80 group-hover:opacity-100'
                        }`}
                      >
                        {p.tradeName?.split(' ')[0] || p.name.split(' ')[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DETAILED ACCREDITED IDENTIFICATION CARD */}
          {selectedProvider && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
              {/* Header zone with NPS score badge and rating */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">
                      CNPJ: {selectedProvider.cnpj}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold uppercase">
                      Homologado
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {selectedProvider.tradeName}
                  </h3>
                  <div className="text-xs text-slate-600 font-medium">
                    Razão Social: {selectedProvider.name}
                  </div>
                </div>

                {/* NPS and Star Cluster */}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      NPS Score
                    </div>
                    <div className="text-2xl font-bold font-mono text-emerald-950 tabular-nums">
                      {selectedProvider.nps}
                    </div>
                    <div className="text-[9px] text-emerald-800 font-semibold">
                      {getNpsBadge(selectedProvider.nps).label}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Avaliação
                    </div>
                    <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span>{selectedProvider.rating}</span>
                    </div>
                    <div className="text-[9px] text-slate-500">
                      {selectedProvider.totalServicesDone} atendimentos
                    </div>
                  </div>

                  {canManage && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleOpenEdit(selectedProvider)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded border border-slate-200"
                        title="Editar Credenciado"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(selectedProvider.id, selectedProvider.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded border border-slate-200"
                        title="Excluir Credenciado"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Identification details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Endereço Completo:</strong>
                      <div className="text-slate-600 mt-0.5">
                        {selectedProvider.street}, nº {selectedProvider.number} - {selectedProvider.neighborhood}
                      </div>
                      <div className="text-slate-600 font-mono">
                        {selectedProvider.city} - {selectedProvider.state} | CEP: {selectedProvider.zipCode}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <strong className="text-slate-900">Horário de Funcionamento:</strong>
                      <div className="text-slate-600">{selectedProvider.openingHours}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <strong className="text-slate-900">Telefone / WhatsApp:</strong>
                      <div className="text-slate-600 font-mono font-medium">{selectedProvider.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <strong className="text-slate-900">E-mail de Contato:</strong>
                      <div className="text-slate-600">{selectedProvider.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <strong className="text-slate-900">Responsável Técnico / Contato:</strong>
                      <div className="text-slate-600">{selectedProvider.contactPerson}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services & Hourly Rate */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 max-w-md">
                  <span className="text-xs font-bold text-slate-900 block">
                    Serviços Homologados & Especialidades:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProvider.services.map((srv, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                        ✓ {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-right shrink-0">
                  <div className="text-[11px] text-slate-500 font-medium">Tabela Homologada:</div>
                  <div className="text-base font-bold font-mono text-slate-900">
                    {formatCurrency(selectedProvider.hourlyRate)} / hora
                  </div>
                  <div className="text-[10px] text-emerald-800 font-semibold">Preço corporativo frota</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Accredited Provider Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-900">
                {editingProvider ? 'Editar Credenciado' : 'Homologar Novo Credenciado'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Nome Fantasia *
                  </label>
                  <input
                    type="text"
                    required
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                    placeholder="Ex: AutoDiesel Especializada Bosch Service"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Razão Social Completa *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: AutoDiesel Turbo & Injeção SP Ltda"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Telefone de Contato
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 3322-1100"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@oficina.com.br"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Responsável na Oficina
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Ex: Carlos (Chefe de Oficina)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Logradouro / Rua e Número
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Av. Marginal Direita do Tietê, 3420"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Vila Maria"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Cidade / UF
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="São Paulo"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Valor Hora de Mão de Obra (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    NPS (-100 a +100)
                  </label>
                  <input
                    type="number"
                    min="-100"
                    max="100"
                    value={nps}
                    onChange={(e) => setNps(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Nota Média (0.0 a 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Serviços Homologados (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={servicesInput}
                    onChange={(e) => setServicesInput(e.target.value)}
                    placeholder="Ex: Injeção Eletrônica, Freios, Troca de Óleo, Pneus"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProvider ? 'Salvar Credenciado' : 'Homologar Credenciado'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
