'use client'

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Truck, CheckCircle, XCircle, 
  ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// --- MOCK DETERMINÍSTICO PARA A LISTAGEM ---
const gerarVeiculosMock = () => {
  const frota = [];
  for (let i = 1; i <= 22; i++) {
    frota.push({
      id: i.toString(),
      prefixo: `FROTA-${String(i).padStart(3, '0')}`,
      placa: `ABC-${1000 + (i * 73) % 9000}`,
      marca: i % 3 === 0 ? 'Scania' : i % 2 === 0 ? 'Volvo' : 'VW',
      modelo: i % 3 === 0 ? 'R450' : i % 2 === 0 ? 'FH 540' : 'Delivery 11.180',
      anoModelo: 2020 + (i % 5),
      renavam: `00${100000000 + (i * 1234567) % 900000000}`,
      chassi: `9BWZZZ${10000000000 + (i * 987654321) % 90000000000}`,
      combustivel: i % 4 === 0 ? 'Etanol/Gasolina' : 'Diesel S10',
      status: i % 7 === 0 ? 'Inativo' : 'Ativo',
    });
  }
  return frota;
};

export default function VeiculosPage() {
  const [veiculos] = useState(gerarVeiculosMock());
  
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'Todos' | 'Ativo' | 'Inativo'>('Todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 15;

  const kpis = useMemo(() => ({
    total: veiculos.length,
    ativos: veiculos.filter(v => v.status === 'Ativo').length,
    inativos: veiculos.filter(v => v.status === 'Inativo').length,
  }), [veiculos]);

  const veiculosFiltrados = useMemo(() => {
    return veiculos.filter(v => {
      const matchBusca = 
        v.placa.toLowerCase().includes(busca.toLowerCase()) || 
        v.modelo.toLowerCase().includes(busca.toLowerCase()) ||
        v.prefixo.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = filtroStatus === 'Todos' || v.status === filtroStatus;
      return matchBusca && matchStatus;
    });
  }, [veiculos, busca, filtroStatus]);

  const totalPaginas = Math.ceil(veiculosFiltrados.length / itensPorPagina);
  const veiculosPaginados = veiculosFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  React.useEffect(() => { setPaginaAtual(1); }, [busca, filtroStatus]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Frota de Veículos</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie cadastros, status e documentação da frota.</p>
        </div>
        
        {/* ROTEAMENTO PARA A NOVA PÁGINA DE CADASTRO */}
        <Link href="/veiculos/novo">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Cadastrar Veículo
          </Button>
        </Link>
      </div>

      {/* CARDS DE KPI */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Cadastrado</CardTitle>
            <Truck className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{kpis.total}</div></CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Habilitados</CardTitle>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{kpis.ativos}</div></CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Desabilitados</CardTitle>
            <XCircle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-rose-600 dark:text-rose-500">{kpis.inativos}</div></CardContent>
        </Card>
      </div>

      {/* BARRA DE FILTROS E BUSCA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input 
            placeholder="Buscar por placa, prefixo ou modelo..." 
            className="pl-9 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus-visible:ring-blue-600" 
            value={busca} onChange={(e) => setBusca(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <div className="flex rounded-md shadow-sm">
            {(['Todos', 'Ativo', 'Inativo'] as const).map((status) => (
              <button 
                key={status} 
                onClick={() => setFiltroStatus(status)} 
                className={`px-4 py-2 text-xs font-medium border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 transition-colors 
                ${filtroStatus === status 
                  ? 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-700 z-10' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABELA DE VEÍCULOS */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow className="border-slate-200 dark:border-slate-800">
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Prefixo</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Placa</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Modelo</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap text-center">Ano</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Combustível</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Renavam / Chassi</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center whitespace-nowrap">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
              {veiculosPaginados.map((v) => (
                <TableRow key={v.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 border-slate-100 dark:border-slate-800 transition-colors">
                  <TableCell className="font-mono font-medium text-slate-600 dark:text-slate-400">{v.prefixo}</TableCell>
                  <TableCell className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-xs">
                      {v.placa}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-200 whitespace-nowrap">{v.marca} {v.modelo}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 font-mono text-center">{v.anoModelo}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 text-xs">{v.combustivel}</TableCell>
                  <TableCell>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex flex-col">
                      <span><strong className="text-slate-700 dark:text-slate-300">R:</strong> {v.renavam}</span>
                      <span><strong className="text-slate-700 dark:text-slate-300">C:</strong> {v.chassi}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={v.status === 'Ativo' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'}>
                      {v.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* PAGINAÇÃO */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Mostrando <strong className="text-slate-900 dark:text-slate-100">{(paginaAtual - 1) * itensPorPagina + 1}</strong> até <strong className="text-slate-900 dark:text-slate-100">{Math.min(paginaAtual * itensPorPagina, veiculosFiltrados.length)}</strong> de <strong className="text-slate-900 dark:text-slate-100">{veiculosFiltrados.length}</strong>
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300" onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} disabled={paginaAtual === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 px-3">Página {paginaAtual} de {totalPaginas}</div>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300" onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} disabled={paginaAtual === totalPaginas}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}