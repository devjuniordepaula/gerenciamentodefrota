'use client'

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, AlertCircle, Plus, Search, Filter, 
  ChevronLeft, ChevronRight, FileCheck 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const regularizacaoMock = [
  { id: '1', placa: 'ABC-1234', modelo: 'Volvo FH 540', exercicio: '2026', ipvaStatus: 'Pago', licenciamentoStatus: 'Regular', statusGeral: 'Regular' },
  { id: '2', placa: 'XYZ-9876', modelo: 'Scania R450', exercicio: '2026', ipvaStatus: 'Pendente', licenciamentoStatus: 'Vencido', statusGeral: 'Crítico' },
  { id: '3', placa: 'DEF-5544', modelo: 'VW Delivery 11.180', exercicio: '2026', ipvaStatus: 'Pago', licenciamentoStatus: 'Regular', statusGeral: 'Regular' },
];

export default function RegularizacaoPage() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'Todos' | 'Regular' | 'Crítico'>('Todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const itensFiltrados = useMemo(() => {
    return regularizacaoMock.filter(item => {
      const matchBusca = item.placa.toLowerCase().includes(busca.toLowerCase()) || item.modelo.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = filtroStatus === 'Todos' || item.statusGeral === filtroStatus;
      return matchBusca && matchStatus;
    });
  }, [busca, filtroStatus]);

  const totalPaginas = Math.ceil(itensFiltrados.length / itensPorPagina);
  const itensPaginados = itensFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* HEADER & BOTÃO DE CADASTRO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Regularização & Obrigações</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Controle de IPVA, Licenciamento, Seguros e Licenças ARCE da frota.</p>
        </div>
        
        <Link href="/veiculos/regularizacao/novo">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Nova Regularização
          </Button>
        </Link>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Veículos Regulares</CardTitle>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-slate-50">18</div></CardContent>
        </Card>
        <Card className="border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-900/10 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Pendências Críticas</CardTitle>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-rose-600 dark:text-rose-400">4</div></CardContent>
        </Card>
      </div>

      {/* BARRA DE FILTROS E BUSCA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input 
            placeholder="Buscar por placa ou modelo..." 
            className="pl-9 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" 
            value={busca} onChange={(e) => setBusca(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <div className="flex rounded-md shadow-sm">
            {(['Todos', 'Regular', 'Crítico'] as const).map((status) => (
              <button 
                key={status} 
                onClick={() => setFiltroStatus(status)} 
                className={`px-4 py-2 text-xs font-medium border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 transition-colors 
                ${filtroStatus === status 
                  ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-700 z-10' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABELA */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow className="border-slate-200 dark:border-slate-800">
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Placa</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Modelo</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Exercício</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">IPVA</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Licenciamento</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">Status Geral</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
              {itensPaginados.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <TableCell className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-xs">{item.placa}</span>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-200 text-sm">{item.modelo}</TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-400 font-mono">{item.exercicio}</TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-400">{item.ipvaStatus}</TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-400">{item.licenciamentoStatus}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={item.statusGeral === 'Regular' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200'}>
                      {item.statusGeral}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}