'use client'

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Wrench, Plus, Search, Filter, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const planosMock = [
  { id: '1', placa: 'ABC-1234', tipo: 'Preventiva', item: 'Troca de Óleo e Filtros', kmAtual: 45000, kmProxima: 50000, status: 'No Prazo', oficina: 'Oficina São Cristóvão', custo: 850.00 },
  { id: '2', placa: 'XYZ-9876', tipo: 'Corretiva', item: 'Reparo no Sistema de Injeção', kmAtual: 180000, kmProxima: '-', status: 'Concluído', oficina: 'Retífica Diesel Express', custo: 3400.00 },
  { id: '3', placa: 'DEF-5544', tipo: 'Preventiva', item: 'Substituição de Pastilhas de Freio', kmAtual: 62000, kmProxima: 60000, status: 'Vencido', oficina: 'Centro Automotivo Rodosul', custo: 1200.00 },
];

export default function PlanosManutencaoPage() {
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | 'Preventiva' | 'Corretiva'>('Todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const formatarMoeda = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const itensFiltrados = useMemo(() => {
    return planosMock.filter(item => {
      const matchBusca = item.placa.toLowerCase().includes(busca.toLowerCase()) || item.item.toLowerCase().includes(busca.toLowerCase());
      const matchTipo = filtroTipo === 'Todos' || item.tipo === filtroTipo;
      return matchBusca && matchTipo;
    });
  }, [busca, filtroTipo]);

  const totalPaginas = Math.ceil(itensFiltrados.length / itensPorPagina);
  const itensPaginados = itensFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* HEADER & BOTÃO DE CADASTRO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Planos & Ordens de Manutenção</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Controle unificado de revisões preventivas e manutenções corretivas da frota.</p>
        </div>
        
        <Link href="/planos/novo">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Nova Manutenção
          </Button>
        </Link>
      </div>

      {/* FILTROS E BUSCA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input 
            placeholder="Buscar por placa ou item..." 
            className="pl-9 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" 
            value={busca} onChange={(e) => setBusca(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <div className="flex rounded-md shadow-sm">
            {(['Todos', 'Preventiva', 'Corretiva'] as const).map((tipo) => (
              <button 
                key={tipo} 
                onClick={() => setFiltroTipo(tipo)} 
                className={`px-4 py-2 text-xs font-medium border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 transition-colors 
                ${filtroTipo === tipo 
                  ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-700 z-10' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABELA DE MANUTENÇÃO */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow className="border-slate-200 dark:border-slate-800">
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Placa</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tipo</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Item / Descrição</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">KM Atual</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Oficina</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-right">Custo Total</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
              {itensPaginados.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <TableCell className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-xs">{item.placa}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={item.tipo === 'Preventiva' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400'}>
                      {item.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-200 text-sm">{item.item}</TableCell>
                  <TableCell className="text-center font-mono text-xs text-slate-600 dark:text-slate-400">{item.kmAtual.toLocaleString()} km</TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-400">{item.oficina}</TableCell>
                  <TableCell className="text-right font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">{formatarMoeda(item.custo)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={item.status === 'No Prazo' || item.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200'}>
                      {item.status}
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