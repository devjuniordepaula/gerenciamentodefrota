'use client'

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, Plus, Search, Filter, 
  ChevronLeft, ChevronRight, UserX, Award 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Mock de multas estruturado com base nos campos solicitados
const multasMock = [
  { id: '1', placa: 'ABC-1234', motorista: 'João Silva', infracao: 'Excesso de velocidade (Até 20%)', valorOriginal: 130.16, valorDesconto: 78.10, pontos: 4, status: 'Pendente', data: '25/09/2026' },
  { id: '2', placa: 'XYZ-9876', motorista: 'Carlos Souza', infracao: 'Avançar sinal vermelho', valorOriginal: 293.47, valorDesconto: 176.08, pontos: 7, status: 'Pago', data: '20/09/2026' },
  { id: '3', placa: 'DEF-5544', motorista: 'João Silva', infracao: 'Estacionar em local proibido', valorOriginal: 195.23, valorDesconto: 117.14, pontos: 4, status: 'Pendente', data: '18/09/2026' },
];

export default function MultasPage() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'Todos' | 'Pendente' | 'Pago'>('Todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const formatarMoeda = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  // Ranking Auxiliar de Motoristas (Colunas X e Y)
  const rankingMotoristas = useMemo(() => {
    const mapa: { [key: string]: { totalPontos: number; valorAcumulado: number; infracoes: number } } = {};
    multasMock.forEach(m => {
      if (!mapa[m.motorista]) {
        mapa[m.motorista] = { totalPontos: 0, valorAcumulado: 0, infracoes: 0 };
      }
      mapa[m.motorista].totalPontos += m.pontos;
      mapa[m.motorista].valorAcumulado += m.valorOriginal;
      mapa[m.motorista].infracoes += 1;
    });
    return Object.entries(mapa)
      .map(([motorista, dados]) => ({ motorista, ...dados }))
      .sort((a, b) => b.totalPontos - a.totalPontos);
  }, []);

  const itensFiltrados = useMemo(() => {
    return multasMock.filter(item => {
      const matchBusca = item.placa.toLowerCase().includes(busca.toLowerCase()) || item.motorista.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = filtroStatus === 'Todos' || item.status === filtroStatus;
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Gestão de Multas & Infrações</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Controle de autuações, indicação de condutores e ressarcimentos.</p>
        </div>
        
        <Link href="/veiculos/multas/novo">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Nova Multa
          </Button>
        </Link>
      </div>

      {/* PAINEL AUXILIAR: RANKING DE MOTORISTAS (X e Y) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Ranking de Condutores (Pontuação & Custos Acumulados)
            </CardTitle>
            <CardDescription className="text-xs dark:text-slate-400">Monitoramento analítico de motoristas com maior incidência de infrações.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rankingMotoristas.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">#{idx + 1} Condutor</span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{item.motorista}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.infracoes} autuação(ões)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-600 dark:text-rose-400 font-mono font-bold text-base">{item.totalPontos} pts</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{formatarMoeda(item.valorAcumulado)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BARRA DE FILTROS E BUSCA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input 
            placeholder="Buscar por placa ou motorista..." 
            className="pl-9 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" 
            value={busca} onChange={(e) => setBusca(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <div className="flex rounded-md shadow-sm">
            {(['Todos', 'Pendente', 'Pago'] as const).map((status) => (
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

      {/* TABELA DE MULTAS */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow className="border-slate-200 dark:border-slate-800">
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Placa</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Condutor</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Infração</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">Pontos</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-right">Valor Original</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-right">c/ Desconto (40%)</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
              {itensPaginados.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <TableCell className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-xs">{item.placa}</span>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-200 text-sm">{item.motorista}</TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-400">{item.infracao}</TableCell>
                  <TableCell className="text-center font-mono text-xs text-rose-600 font-bold">{item.pontos} pts</TableCell>
                  <TableCell className="text-right text-xs text-slate-700 dark:text-slate-300 font-mono">{formatarMoeda(item.valorOriginal)}</TableCell>
                  <TableCell className="text-right text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">{formatarMoeda(item.valorDesconto)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={item.status === 'Pago' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200'}>
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