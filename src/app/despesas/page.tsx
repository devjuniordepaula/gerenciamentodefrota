'use client'

import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Receipt, TrendingUp, AlertCircle, 
  ChevronLeft, ChevronRight, Filter, PieChart as PieChartIcon, 
  Calendar, FileText, CheckCircle2, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Componentes do Modal
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Gráficos (Recharts)
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- MOCK DETERMINÍSTICO DE DESPESAS ---
const gerarDespesasMock = () => {
  const despesas = [];
  const categorias = ['Peças', 'Serviços', 'Combustível', 'Impostos/Taxas'];
  const statusList = ['Pago', 'Pendente'];
  
  for (let i = 1; i <= 35; i++) {
    const valor = 150 + ((i * 345) % 3000);
    const mes = (i % 6) + 1; // Jan a Jun
    
    despesas.push({
      id: i.toString(),
      descricao: `OS #${1000 + i} - Manutenção Preventiva`,
      placa: `ABC-${1000 + (i * 73) % 9000}`,
      categoria: categorias[i % categorias.length],
      valor: valor,
      data: `2026-0${mes}-1${(i % 9) + 1}`,
      status: i % 5 === 0 ? 'Pendente' : 'Pago',
    });
  }
  return despesas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
};

const estadoInicialFormulario = { descricao: '', placa: '', categoria: '', valor: '', data: '', status: 'Pendente' };

// Cores para o gráfico de rosca (Tailwind Colors hex)
const CORES_CATEGORIAS = {
  'Peças': '#3b82f6',       // blue-500
  'Serviços': '#10b981',    // emerald-500
  'Combustível': '#f59e0b', // amber-500
  'Impostos/Taxas': '#f43f5e' // rose-500
};

export default function DespesasPage() {
  const [despesas, setDespesas] = useState(gerarDespesasMock());
  
  // Estados de Filtro e Paginação
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'Todos' | 'Pago' | 'Pendente'>('Todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(estadoInicialFormulario);

  // --- LÓGICA DE DADOS (KPIs e Gráficos) ---
  const { kpis, dadosGraficoMes, dadosGraficoCategoria } = useMemo(() => {
    let totalPago = 0;
    let totalPendente = 0;
    
    const gastosPorMes: Record<string, number> = {};
    const gastosPorCategoria: Record<string, number> = {};

    despesas.forEach(d => {
      // KPIs
      if (d.status === 'Pago') totalPago += d.valor;
      else totalPendente += d.valor;

      // Agrupamento por Categoria
      gastosPorCategoria[d.categoria] = (gastosPorCategoria[d.categoria] || 0) + d.valor;

      // Agrupamento por Mês (Simplificado para o mock: extrai o mês da string YYYY-MM-DD)
      const mesNum = d.data.split('-')[1];
      const nomeMes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][parseInt(mesNum) - 1];
      gastosPorMes[nomeMes] = (gastosPorMes[nomeMes] || 0) + d.valor;
    });

    // Formatação para o Recharts
    const chartMeses = Object.keys(gastosPorMes).map(mes => ({ name: mes, total: gastosPorMes[mes] }));
    const chartCategorias = Object.keys(gastosPorCategoria).map(cat => ({ name: cat, value: gastosPorCategoria[cat] }));

    return {
      kpis: { totalGeral: totalPago + totalPendente, totalPago, totalPendente },
      dadosGraficoMes: chartMeses.reverse(), // Ordem cronológica mockada
      dadosGraficoCategoria: chartCategorias
    };
  }, [despesas]);

  // --- FILTRAGEM E PAGINAÇÃO ---
  const despesasFiltradas = useMemo(() => {
    return despesas.filter(d => {
      const matchBusca = 
        d.descricao.toLowerCase().includes(busca.toLowerCase()) || 
        d.placa.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = filtroStatus === 'Todos' || d.status === filtroStatus;
      return matchBusca && matchStatus;
    });
  }, [despesas, busca, filtroStatus]);

  const totalPaginas = Math.ceil(despesasFiltradas.length / itensPorPagina);
  const despesasPaginadas = despesasFiltradas.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  React.useEffect(() => { setPaginaAtual(1); }, [busca, filtroStatus]);

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === 'placa' ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSelectChange = (name: string, value: string | null | undefined) => {
    setFormData(prev => ({ ...prev, [name]: value || '' }));
  };

  const confirmarCadastro = () => {
    const novaDespesa = {
      id: Math.random().toString(36).substr(2, 9),
      descricao: formData.descricao || 'Despesa Avulsa',
      placa: formData.placa,
      categoria: formData.categoria || 'Outros',
      valor: parseFloat(formData.valor) || 0,
      data: formData.data || new Date().toISOString().split('T')[0],
      status: formData.status,
    };

    setDespesas(prev => [novaDespesa, ...prev]);
    setIsModalOpen(false);
    setFormData(estadoInicialFormulario);
  };

  const formatarMoeda = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* CABEÇALHO (H3: Controle do Usuário) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Gestão de Despesas</h2>
          <p className="text-sm text-slate-500">Acompanhamento financeiro, ordens de serviço e custos fixos.</p>
        </div>
        
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm w-full sm:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Lançar Despesa
        </Button>
      </div>

      {/* === MODAL DE LANÇAMENTO === */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Nova Despesa</DialogTitle>
            <DialogDescription>Lançamento de custos vinculados ou não à frota.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="detalhes" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="detalhes" className="flex items-center gap-2"><FileText className="w-4 h-4" /> Detalhes</TabsTrigger>
              <TabsTrigger value="financeiro" className="flex items-center gap-2"><Receipt className="w-4 h-4" /> Valores</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detalhes" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Descrição / OS</label>
                <Input name="descricao" placeholder="Ex: Troca de Óleo - Oficina 1" value={formData.descricao} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Placa (Opcional)</label>
                  <Input name="placa" placeholder="ABC-1234" value={formData.placa} onChange={handleInputChange} maxLength={8} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Categoria</label>
                  <Select value={formData.categoria} onValueChange={(val) => handleSelectChange('categoria', val)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Peças">Peças</SelectItem>
                      <SelectItem value="Serviços">Serviços</SelectItem>
                      <SelectItem value="Combustível">Combustível</SelectItem>
                      <SelectItem value="Impostos/Taxas">Impostos/Taxas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Valor (R$)</label>
                <Input name="valor" type="number" placeholder="0.00" step="0.01" value={formData.valor} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Data de Venc/Pgto</label>
                  <Input name="data" type="date" value={formData.data} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pago">Pago</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 border-t pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto mb-2 sm:mb-0">Cancelar</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto" onClick={confirmarCadastro}>Salvar Despesa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === DASHBOARD GRÁFICO & KPIs (Mobile-First Grid) === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna 1: KPIs Empilhados */}
        <div className="flex flex-col gap-4">
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Custo Total (Histórico)</CardTitle>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold text-slate-900">{formatarMoeda(kpis.totalGeral)}</div></CardContent>
          </Card>
          
          <Card className="border-slate-200 shadow-xs bg-emerald-50/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Total Pago</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-emerald-600">{formatarMoeda(kpis.totalPago)}</div></CardContent>
          </Card>

          <Card className="border-slate-200 shadow-xs bg-amber-50/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-amber-700 uppercase tracking-wider">A Pagar / Pendente</CardTitle>
              <Clock className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-amber-600">{formatarMoeda(kpis.totalPendente)}</div></CardContent>
          </Card>
        </div>

        {/* Coluna 2: Gráfico de Barras (Mes a Mes) */}
        <Card className="border-slate-200 shadow-xs lg:col-span-1 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" /> Evolução Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGraficoMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `R$${val/1000}k`} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => formatarMoeda(value)} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Coluna 3: Gráfico de Rosca (Peças x Serviços) */}
        <Card className="border-slate-200 shadow-xs lg:col-span-1 flex flex-col">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-blue-500" /> Custos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[200px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dadosGraficoCategoria} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                  {dadosGraficoCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES_CATEGORIAS[entry.name as keyof typeof CORES_CATEGORIAS] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => formatarMoeda(value)} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legenda Customizada (Mobile Friendly) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-xs text-slate-500 block">Total</span>
              <span className="font-bold text-slate-900 text-sm">{formatarMoeda(kpis.totalGeral).split(',')[0]}</span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* === TABELA DE DESPESAS === */}
      <div className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input placeholder="Buscar por OS, descrição ou placa..." className="pl-9 bg-slate-50 border-slate-200" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <div className="flex rounded-md shadow-sm">
              {(['Todos', 'Pago', 'Pendente'] as const).map((status) => (
                <button key={status} onClick={() => setFiltroStatus(status)} className={`px-4 py-2 text-xs font-medium border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 transition-colors ${filtroStatus === status ? 'bg-slate-800 text-white border-slate-800 z-10' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista/Tabela */}
        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700 min-w-[200px]">Descrição</TableHead>
                  <TableHead className="font-semibold text-slate-700">Categoria</TableHead>
                  <TableHead className="font-semibold text-slate-700">Data</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Valor</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {despesasPaginadas.map((d) => (
                  <TableRow key={d.id} className="hover:bg-slate-100/60 even:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{d.descricao}</span>
                        {d.placa && <span className="text-xs font-mono text-slate-500 mt-0.5 border border-slate-200 bg-white px-1.5 rounded w-fit">{d.placa}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CORES_CATEGORIAS[d.categoria as keyof typeof CORES_CATEGORIAS] || '#ccc' }} />
                        {d.categoria}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {new Date(d.data).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-900">
                      {formatarMoeda(d.valor)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`font-medium border-0 ${d.status === 'Pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {d.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {despesasPaginadas.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-500">Nenhuma despesa encontrada.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500">
                Mostrando <strong className="text-slate-900">{(paginaAtual - 1) * itensPorPagina + 1}</strong> a <strong className="text-slate-900">{Math.min(paginaAtual * itensPorPagina, despesasFiltradas.length)}</strong> de {despesasFiltradas.length}
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
    </div>
  );
}