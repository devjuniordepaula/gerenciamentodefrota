'use client'

import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Wrench, Calendar, AlertCircle, 
  ChevronLeft, ChevronRight, Filter, ShieldCheck, 
  Settings, Trash2, ListChecks
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// --- MOCK DETERMINÍSTICO ---
const gerarPlanosMock = () => {
  const planos = [];
  for (let i = 1; i <= 12; i++) {
    const isPreventiva = i % 3 !== 0;
    const isKm = i % 2 === 0;
    
    planos.push({
      id: i.toString(),
      nome: isPreventiva ? `Revisão Padrão ${i * 10}k` : `Recall Fábrica 00${i}`,
      tipo: isPreventiva ? 'Preventiva' : 'Garantia',
      alvoTipo: i % 3 === 0 ? 'Marca' : i % 2 === 0 ? 'Modelo' : 'Placa',
      alvoValor: i % 3 === 0 ? 'Volvo' : i % 2 === 0 ? 'FH 540' : `ABC-100${i}, XYZ-200${i}`,
      gatilhoTipo: isKm ? 'KM' : 'Data',
      gatilhoValor: isKm ? `${(i * 10000)} km` : `2026-1${i % 2 === 0 ? '1' : '2'}-15`,
      itens: ['Óleo de Motor', 'Filtro de Óleo', 'Filtro de Combustível'].slice(0, (i % 3) + 1),
      status: i % 7 === 0 ? 'Atrasado' : 'Ativo',
      observacao: 'Manutenção obrigatória conforme manual.'
    });
  }
  return planos;
};

const estadoInicialFormulario = { 
  nome: '', tipo: 'Preventiva', observacao: '',
  alvoTipo: 'Placa', alvoValor: '',
  gatilhoTipo: 'KM', gatilhoValor: '' 
};

export default function PlanosManutencaoPage() {
  const [planos, setPlanos] = useState(gerarPlanosMock());
  
  // Estados de Filtro e Paginação
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | 'Preventiva' | 'Garantia'>('Todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  // Estado do Formulário Complexo
  const [formData, setFormData] = useState(estadoInicialFormulario);
  const [itensManutencao, setItensManutencao] = useState<{id: string, nome: string}[]>([]);
  const [novoItemNome, setNovoItemNome] = useState('');

  // --- KPIs ---
  const kpis = useMemo(() => ({
    total: planos.length,
    preventivas: planos.filter(p => p.tipo === 'Preventiva').length,
    garantias: planos.filter(p => p.tipo === 'Garantia').length,
    atrasados: planos.filter(p => p.status === 'Atrasado').length,
  }), [planos]);

  // --- FILTRAGEM E PAGINAÇÃO ---
  const planosFiltrados = useMemo(() => {
    return planos.filter(p => {
      const matchBusca = 
        p.nome.toLowerCase().includes(busca.toLowerCase()) || 
        p.alvoValor.toLowerCase().includes(busca.toLowerCase());
      const matchTipo = filtroTipo === 'Todos' || p.tipo === filtroTipo;
      return matchBusca && matchTipo;
    });
  }, [planos, busca, filtroTipo]);

  const totalPaginas = Math.ceil(planosFiltrados.length / itensPorPagina);
  const planosPaginados = planosFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  React.useEffect(() => { setPaginaAtual(1); }, [busca, filtroTipo]);

  // --- HANDLERS DO FORMULÁRIO ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null | undefined) => {
    setFormData(prev => ({ ...prev, [name]: value || '' }));
  };

  // Gerenciamento Dinâmico de Itens
  const adicionarItem = () => {
    if (novoItemNome.trim() === '') return;
    setItensManutencao(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), nome: novoItemNome }]);
    setNovoItemNome('');
  };

  const removerItem = (id: string) => {
    setItensManutencao(prev => prev.filter(item => item.id !== id));
  };

  const confirmarCadastro = () => {
    const novoPlano = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      itens: itensManutencao.map(i => i.nome),
      status: 'Ativo'
    };

    setPlanos(prev => [novoPlano, ...prev]);
    setIsAlertOpen(false);
    setIsModalOpen(false);
    setFormData(estadoInicialFormulario);
    setItensManutencao([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Planos de Manutenção</h2>
          <p className="text-sm text-slate-500">Agende e padronize preventivas e garantias da frota.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Novo Plano
        </Button>
      </div>

      {/* === MODAL DE CADASTRO === */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white h-[90vh] sm:h-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Cadastrar Plano de Manutenção</DialogTitle>
            <DialogDescription>Configure as regras, gatilhos e itens deste plano.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="geral" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="geral" className="text-xs sm:text-sm">Geral</TabsTrigger>
              <TabsTrigger value="regras" className="text-xs sm:text-sm">Regras & Gatilhos</TabsTrigger>
              <TabsTrigger value="itens" className="text-xs sm:text-sm">Itens Inclusos</TabsTrigger>
            </TabsList>
            
            {/* ABA 1: GERAL */}
            <TabsContent value="geral" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nome do Plano</label>
                <Input name="nome" placeholder="Ex: Revisão Completa 50.000km" value={formData.nome} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Tipo de Manutenção</label>
                <Select value={formData.tipo} onValueChange={(val) => handleSelectChange('tipo', val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preventiva">Preventiva (Revisões Periódicas)</SelectItem>
                    <SelectItem value="Garantia">Garantia (Peças/Fábrica)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Observações Internas</label>
                <textarea 
                  name="observacao" 
                  className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 min-h-[80px]" 
                  placeholder="Instruções para o mecânico ou gestor..."
                  value={formData.observacao}
                  onChange={handleInputChange}
                />
              </div>
            </TabsContent>

            {/* ABA 2: APLICAÇÃO E GATILHOS (Onde a mágica UX acontece) */}
            <TabsContent value="regras" className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                <h4 className="font-medium text-slate-900 text-sm flex items-center gap-2"><Wrench className="w-4 h-4 text-blue-600"/> Veículos Alvo</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700">Aplicar por</label>
                    <Select value={formData.alvoTipo} onValueChange={(val) => handleSelectChange('alvoTipo', val)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Placa">Placas Específicas</SelectItem>
                        <SelectItem value="Modelo">Modelo do Veículo</SelectItem>
                        <SelectItem value="Marca">Marca Completa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-medium text-slate-700">Valores (Separe por vírgula)</label>
                    <Input name="alvoValor" placeholder={formData.alvoTipo === 'Placa' ? 'ABC-1234, XYZ-9876' : formData.alvoTipo === 'Modelo' ? 'FH 540, R450' : 'Volvo, Scania'} value={formData.alvoValor} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                <h4 className="font-medium text-slate-900 text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600"/> Gatilho de Vencimento</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700">Avisar com base em</label>
                    <Select value={formData.gatilhoTipo} onValueChange={(val) => handleSelectChange('gatilhoTipo', val)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KM">Quilometragem (KM)</SelectItem>
                        <SelectItem value="Data">Data Prevista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700">{formData.gatilhoTipo === 'KM' ? 'Aos quantos KM?' : 'Qual a Data Limite?'}</label>
                    <Input 
                      name="gatilhoValor" 
                      type={formData.gatilhoTipo === 'KM' ? 'number' : 'date'} 
                      placeholder={formData.gatilhoTipo === 'KM' ? 'Ex: 50000' : ''} 
                      value={formData.gatilhoValor} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ABA 3: ITENS DINÂMICOS */}
            <TabsContent value="itens" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">O que será trocado/verificado?</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ex: Óleo de Motor 15W40" 
                    value={novoItemNome} 
                    onChange={(e) => setNovoItemNome(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && adicionarItem()}
                  />
                  <Button type="button" onClick={adicionarItem} variant="secondary" className="shrink-0 bg-slate-200 hover:bg-slate-300">
                    Adicionar
                  </Button>
                </div>
              </div>

              <div className="mt-4 border rounded-md border-slate-200 divide-y divide-slate-100 max-h-[200px] overflow-y-auto bg-slate-50">
                {itensManutencao.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-6">Nenhum item adicionado ainda.</p>
                ) : (
                  itensManutencao.map(item => (
                    <div key={item.id} className="flex items-center justify-between px-3 py-2 bg-white">
                      <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item.nome}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removerItem(item.id)} className="h-6 w-6 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 border-t pt-4 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">Cancelar</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto" onClick={() => setIsAlertOpen(true)}>Salvar Plano</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === ALERT DIALOG === */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Novo Plano?</AlertDialogTitle>
            <AlertDialogDescription>
              O plano <strong>{formData.nome || 'Sem nome'}</strong> será aplicado aos veículos definidos por {formData.alvoTipo}. Confirma a criação?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Revisar</AlertDialogCancel>
            <AlertDialogAction className="bg-blue-600 hover:bg-blue-700 text-white" onClick={confirmarCadastro}>Sim, Criar Plano</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* === DASHBOARD DE KPIs === */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Planos Ativos</CardTitle>
            <ListChecks className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-slate-900">{kpis.total}</div></CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Preventivas</CardTitle>
            <Settings className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-emerald-600">{kpis.preventivas}</div></CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-amber-700 uppercase tracking-wider">Garantias</CardTitle>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-amber-600">{kpis.garantias}</div></CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/50 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-rose-700 uppercase tracking-wider">Atrasados / Alertas</CardTitle>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-rose-600">{kpis.atrasados}</div></CardContent>
        </Card>
      </div>

      {/* === FILTROS === */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input placeholder="Buscar plano, veículo ou marca..." className="pl-9 bg-slate-50 border-slate-200" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <div className="flex rounded-md shadow-sm">
            {(['Todos', 'Preventiva', 'Garantia'] as const).map((tipo) => (
              <button key={tipo} onClick={() => setFiltroTipo(tipo)} className={`px-4 py-2 text-xs font-medium border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 transition-colors ${filtroTipo === tipo ? 'bg-slate-800 text-white border-slate-800 z-10' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                {tipo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* === TABELA DE PLANOS === */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap min-w-[250px]">Plano & Tipo</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Aplicação (Alvos)</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Gatilho</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Itens Previstos</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center whitespace-nowrap">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {planosPaginados.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-100/60 even:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{p.nome}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        {p.tipo === 'Preventiva' ? <Settings className="w-3 h-3 text-slate-400" /> : <ShieldCheck className="w-3 h-3 text-slate-400" />}
                        {p.tipo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{p.alvoTipo}</span>
                      <span className="text-sm font-medium text-slate-900">{p.alvoValor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono bg-blue-50 text-blue-700 border-blue-200 text-xs py-0.5">
                      {p.gatilhoTipo}: {p.gatilhoValor}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {p.itens.length > 0 ? p.itens.map((item, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded whitespace-nowrap">
                          {item}
                        </span>
                      )) : <span className="text-xs text-slate-400">Nenhum item</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`font-medium border-0 ${p.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse'}`}>
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {planosPaginados.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-500">Nenhum plano encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* PAGINAÇÃO */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <span className="text-xs text-slate-500">
              Mostrando <strong className="text-slate-900">{(paginaAtual - 1) * itensPorPagina + 1}</strong> a <strong className="text-slate-900">{Math.min(paginaAtual * itensPorPagina, planosFiltrados.length)}</strong> de {planosFiltrados.length}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} disabled={paginaAtual === 1}><ChevronLeft className="w-4 h-4" /></Button>
              <div className="text-xs font-medium text-slate-600 px-3">Página {paginaAtual} de {totalPaginas}</div>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} disabled={paginaAtual === totalPaginas}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}