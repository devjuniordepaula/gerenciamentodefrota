'use client'

import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Building2, Briefcase, 
  Wallet, AlertCircle, ChevronRight, Tags
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- MOCK DETERMINÍSTICO ---
const gerarSetoresMock = () => [
  { id: '1', codigo: 'LOG-001', nome: 'Logística SP', orcamento: 150000, consumido: 142000, centrosCusto: ['Frota Leve', 'Frota Pesada', 'Manutenção'] },
  { id: '2', codigo: 'OPE-002', nome: 'Operações RJ', orcamento: 80000, consumido: 35000, centrosCusto: ['Entregas Expressas', 'Armazém'] },
  { id: '3', codigo: 'ADM-003', nome: 'Administrativo', orcamento: 25000, consumido: 10000, centrosCusto: ['Diretoria', 'RH', 'TI'] },
  { id: '4', codigo: 'COM-004', nome: 'Comercial', orcamento: 40000, consumido: 39500, centrosCusto: ['Vendas Externas', 'Marketing'] },
];

const estadoInicialFormulario = { codigo: '', nome: '', orcamento: '', centrosCusto: '' };

export default function SetoresPage() {
  const [setores, setSetores] = useState(gerarSetoresMock());
  const [busca, setBusca] = useState('');
  
  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(estadoInicialFormulario);

  // --- KPIs DE NEGÓCIO ---
  const kpis = useMemo(() => {
    const totalOrcamento = setores.reduce((acc, s) => acc + s.orcamento, 0);
    const totalConsumido = setores.reduce((acc, s) => acc + s.consumido, 0);
    const percentualGeral = totalOrcamento > 0 ? (totalConsumido / totalOrcamento) * 100 : 0;
    
    return {
      totalSetores: setores.length,
      totalOrcamento,
      totalConsumido,
      percentualGeral,
      saldoDisponivel: totalOrcamento - totalConsumido
    };
  }, [setores]);

  // --- FILTRAGEM ---
  const setoresFiltrados = useMemo(() => {
    return setores.filter(s => 
      s.nome.toLowerCase().includes(busca.toLowerCase()) || 
      s.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      s.centrosCusto.some(cc => cc.toLowerCase().includes(busca.toLowerCase()))
    );
  }, [setores, busca]);

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === 'codigo' ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const confirmarCadastro = () => {
    // Transforma a string separada por vírgulas em um array de Centros de Custo (Micro)
    const arrayCentrosDeCusto = formData.centrosCusto
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const novoSetor = {
      id: Math.random().toString(36).substr(2, 9),
      codigo: formData.codigo || `SETOR-${Math.floor(Math.random() * 1000)}`,
      nome: formData.nome,
      orcamento: parseFloat(formData.orcamento) || 0,
      consumido: 0, // Setor novo começa sem consumo
      centrosCusto: arrayCentrosDeCusto.length > 0 ? arrayCentrosDeCusto : ['Geral'],
    };

    setSetores(prev => [novoSetor, ...prev]);
    setIsModalOpen(false);
    setFormData(estadoInicialFormulario);
  };

  // Helper para formatar moeda
  const formatarMoeda = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* CABEÇALHO (Mobile-First: Empilha no celular, alinha no desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Setores & Centros de Custo</h2>
          <p className="text-sm text-slate-500">Controle macro e micro do orçamento da sua empresa.</p>
        </div>
        
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm w-full sm:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Departamento
        </Button>
      </div>

      {/* === MODAL DE CADASTRO === */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Criar Departamento</DialogTitle>
            <DialogDescription>
              Defina o orçamento macro e as subdivisões (Centros de Custo).
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="macro" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="macro" className="flex items-center gap-2"><Building2 className="w-4 h-4" /> Macro (Setor)</TabsTrigger>
              <TabsTrigger value="micro" className="flex items-center gap-2"><Tags className="w-4 h-4" /> Micro (Centros)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="macro" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-slate-700">Nome do Departamento</label>
                  <Input name="nome" placeholder="Ex: Operações Sul" value={formData.nome} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Código</label>
                  <Input name="codigo" placeholder="OPE-001" value={formData.codigo} onChange={handleInputChange} maxLength={10} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Orçamento Mensal (R$)</label>
                  <Input name="orcamento" type="number" placeholder="50000" value={formData.orcamento} onChange={handleInputChange} inputMode="numeric" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="micro" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Centros de Custo vinculados</label>
                <p className="text-xs text-slate-500 mb-2">Separe os nomes por vírgula (Ex: Frota Leve, Manutenção, Combustível).</p>
                <Input 
                  name="centrosCusto" 
                  placeholder="Frota Leve, Frota Pesada..." 
                  value={formData.centrosCusto} 
                  onChange={handleInputChange} 
                />
              </div>
              {formData.centrosCusto && (
                <div className="flex flex-wrap gap-2 mt-4 p-3 bg-slate-50 rounded-md border border-slate-100">
                  {formData.centrosCusto.split(',').map((cc, idx) => cc.trim() && (
                    <Badge key={idx} variant="secondary" className="bg-white border-slate-200 text-slate-700">
                      {cc.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 border-t pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto mb-2 sm:mb-0">Cancelar</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto" onClick={confirmarCadastro}>
              Salvar Setor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CARDS DE KPI DE SAÚDE FINANCEIRA */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Orçamento Total</CardTitle>
            <Wallet className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatarMoeda(kpis.totalOrcamento)}</div>
            <p className="text-xs text-slate-500 mt-1">Soma de todos os setores</p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Saldo Disponível</CardTitle>
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatarMoeda(kpis.saldoDisponivel)}</div>
            <div className="mt-3">
              <Progress value={100 - kpis.percentualGeral} className="h-1.5 bg-slate-100" />
            </div>
          </CardContent>
        </Card>

        <Card className={kpis.percentualGeral > 90 ? "border-rose-200 bg-rose-50/50 shadow-xs" : "border-slate-200 shadow-xs"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Consumo Global</CardTitle>
            {kpis.percentualGeral > 90 ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <Building2 className="w-4 h-4 text-slate-400" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${kpis.percentualGeral > 90 ? 'text-rose-600' : 'text-slate-900'}`}>
              {kpis.percentualGeral.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500 mt-1">{formatarMoeda(kpis.totalConsumido)} utilizados</p>
          </CardContent>
        </Card>
      </div>

      {/* BARRA DE FILTRO */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input 
            placeholder="Buscar por setor, código ou centro de custo..." 
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-600" 
            value={busca} onChange={(e) => setBusca(e.target.value)} 
          />
        </div>
      </div>

      {/* TABELA RESPONSIVA DE SETORES */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap min-w-[200px]">Setor (Macro)</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap min-w-[250px]">Centros de Custo (Micro)</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap min-w-[200px]">Saúde do Orçamento</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right whitespace-nowrap">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {setoresFiltrados.map((setor) => {
                const percentual = setor.orcamento > 0 ? (setor.consumido / setor.orcamento) * 100 : 0;
                // Semântica de cores H1 Nielsen
                const corBarra = percentual > 90 ? 'bg-rose-500' : percentual > 75 ? 'bg-amber-400' : 'bg-emerald-500';
                
                return (
                  <TableRow key={setor.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* MACRO */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{setor.nome}</span>
                        <span className="text-xs font-mono text-slate-500">{setor.codigo}</span>
                      </div>
                    </TableCell>
                    
                    {/* MICRO */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {setor.centrosCusto.map((cc, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-normal text-[10px] px-1.5 py-0">
                            {cc}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    {/* SAÚDE FINANCEIRA (UX Visual) */}
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700">{formatarMoeda(setor.consumido)}</span>
                          <span className="text-slate-500">de {formatarMoeda(setor.orcamento)}</span>
                        </div>
                        {/* Progress Bar customizada */}
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className={`h-full ${corBarra} transition-all duration-500`} style={{ width: `${Math.min(percentual, 100)}%` }} />
                        </div>
                      </div>
                    </TableCell>

                    {/* AÇÕES */}
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 p-0">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

    </div>
  );
}