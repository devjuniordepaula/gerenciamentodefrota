'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Receipt, Plus, Truck, DollarSign, TrendingUp, 
  Building, Wrench, AlertTriangle, ArrowUpRight, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';

// --- MOCK ESTRUTURADO (TABLE_7, TABLE_8 E RANKINGS DE CUSTO/KM) ---
const custosFrotaMock = [
  { id: '1', placa: 'ABC-1234', modelo: 'Volvo FH 540', setor: 'Logística Matriz', preventiva: 2400.00, corretivas: 4500.00, pecas: 3800.00, multas: 130.16, docSeguroIpva: 5200.00, kmRodado: 24500 },
  { id: '2', placa: 'XYZ-9876', modelo: 'Scania R450', setor: 'Filial SP', preventiva: 1800.00, corretivas: 8900.00, pecas: 6100.00, multas: 293.47, docSeguroIpva: 4800.00, kmRodado: 31000 },
  { id: '3', placa: 'DEF-5544', modelo: 'VW Delivery 11.180', setor: 'Operacional CE', preventiva: 950.00, corretivas: 1200.00, pecas: 850.00, multas: 0.00, docSeguroIpva: 3100.00, kmRodado: 14200 },
  { id: '4', placa: 'GHI-3322', modelo: 'Mercedes-Benz Atego', setor: 'Logística Matriz', preventiva: 3100.00, corretivas: 11500.00, pecas: 9200.00, multas: 390.00, docSeguroIpva: 4200.00, kmRodado: 38500 },
];

export default function DespesasConsolidadasPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  const formatarMoeda = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  // Processamento analítico determinístico (Table_7, Table_8 e Custo/KM)
  const dadosConsolidados = useMemo(() => {
    let custoTotalGeral = 0;
    let kmTotalGeral = 0;

    const processados = custosFrotaMock.map(item => {
      const custoTotal = item.preventiva + item.corretivas + item.pecas + item.multas + item.docSeguroIpva;
      const custoPorKm = item.kmRodado > 0 ? custoTotal / item.kmRodado : 0;
      
      custoTotalGeral += custoTotal;
      kmTotalGeral += item.kmRodado;

      return {
        ...item,
        custoTotal,
        custoPorKm
      };
    });

    // Ranking de mais onerosos (Table_8) ordenados por Custo Total decrescente
    const maisOnerosos = [...processados].sort((a, b) => b.custoTotal - a.custoTotal);

    // Ranking por Custo / KM ordenados de forma decrescente
    const porCustoKm = [...processados].sort((a, b) => b.custoPorKm - a.custoPorKm);

    return {
      lista: processados,
      custoTotalGeral,
      kmTotalGeral,
      veiculoMaisOneroso: maisOnerosos[0] || null,
      maisOnerosos,
      porCustoKm
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Consolidação de Custos da Frota</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Painel gerencial de despesas, custos por KM e indicadores de eficiência. <span className="font-medium text-slate-700 dark:text-slate-300">• Última atualização: 30/09/2026</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Lançar Nova Despesa
          </Button>
        </div>
      </div>

      {/* 3 INDICADORES PRINCIPAIS NO TOPO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Custo Total da Frota */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Custo Total da Frota</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{formatarMoeda(dadosConsolidados.custoTotalGeral)}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Soma de preventivas, corretivas, peças e encargos</p>
          </CardContent>
        </Card>

        {/* KM Total Rodado */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">KM Total Rodado</CardTitle>
            <Truck className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{dadosConsolidados.kmTotalGeral.toLocaleString('pt-BR')} km</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Quilometragem acumulada da frota ativa</p>
          </CardContent>
        </Card>

        {/* Veículo Mais Oneroso */}
        <Card className="border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-900/10 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Veículo Mais Oneroso</CardTitle>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400 truncate">
              {dadosConsolidados.veiculoMaisOneroso ? `${dadosConsolidados.veiculoMaisOneroso.modelo} (${dadosConsolidados.veiculoMaisOneroso.placa})` : 'N/A'}
            </div>
            <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">
              {dadosConsolidados.veiculoMaisOneroso ? formatarMoeda(dadosConsolidados.veiculoMaisOneroso.custoTotal) : 'R$ 0,00'} acumulados
            </p>
          </CardContent>
        </Card>

      </div>

      {/* SEÇÃO SECUNDÁRIA: RANKINGS ANALÍTICOS (Table_8 e Custo/KM) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ranking de Veículos Mais Onerosos (Table_8) */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" /> Ranking: Veículos Mais Onerosos
            </CardTitle>
            <CardDescription className="text-xs dark:text-slate-400">Ativos com maior volume de gastos absolutos.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHead className="text-xs font-semibold">Pos.</TableHead>
                  <TableHead className="text-xs font-semibold">Placa / Veículo</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Custo Total</TableHead>
                  <TableHead className="text-xs font-semibold text-right">R$ / KM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dadosConsolidados.maisOnerosos.map((v, idx) => (
                  <TableRow key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <TableCell className="font-bold text-xs text-slate-500">#{idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{v.modelo}</span>
                        <span className="font-mono text-[11px] text-slate-500">{v.placa}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {formatarMoeda(v.custoTotal)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-slate-600 dark:text-slate-400">
                      R$ {v.custoPorKm.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Ranking por Custo / KM */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" /> Ranking: Eficiência (Custo / KM)
            </CardTitle>
            <CardDescription className="text-xs dark:text-slate-400">Veículos com maior custo operacional por quilômetro rodado.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHead className="text-xs font-semibold">Pos.</TableHead>
                  <TableHead className="text-xs font-semibold">Placa / Veículo</TableHead>
                  <TableHead className="text-xs font-semibold text-right">R$ / KM</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Custo Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dadosConsolidados.porCustoKm.map((v, idx) => (
                  <TableRow key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <TableCell className="font-bold text-xs text-slate-500">#{idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{v.modelo}</span>
                        <span className="font-mono text-[11px] text-slate-500">{v.placa}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                      R$ {v.custoPorKm.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400">
                      {formatarMoeda(v.custoTotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>

      {/* TABELA PRINCIPAL DE CUSTOS POR VEÍCULO (TABLE_7) */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">Detalhamento Analítico — Custos por Veículo</CardTitle>
          <CardDescription className="text-xs dark:text-slate-400">Visão granular por ativo contemplando manutenções, peças, multas e encargos legais.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                <TableRow className="border-slate-200 dark:border-slate-800">
                  <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Placa</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Marca / Modelo</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300">Setor / Contrato</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-right">Preventivas</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-right">Corretivas</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-right">Peças</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-right">Multas</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-right">Doc/Seguro/IPVA</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-right font-bold">Custo Total</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">KM Total</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-right font-bold">R$ / KM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dadosConsolidados.lista.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <TableCell className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-xs">{item.placa}</span>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900 dark:text-slate-200 text-sm whitespace-nowrap">{item.modelo}</TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{item.setor}</TableCell>
                    <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400 font-mono">{formatarMoeda(item.preventiva)}</TableCell>
                    <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400 font-mono">{formatarMoeda(item.corretivas)}</TableCell>
                    <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400 font-mono">{formatarMoeda(item.pecas)}</TableCell>
                    <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400 font-mono">{formatarMoeda(item.multas)}</TableCell>
                    <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400 font-mono">{formatarMoeda(item.docSeguroIpva)}</TableCell>
                    <TableCell className="text-right font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">{formatarMoeda(item.custoTotal)}</TableCell>
                    <TableCell className="text-center font-mono text-xs text-slate-600 dark:text-slate-400">{item.kmRodado.toLocaleString()} km</TableCell>
                    <TableCell className="text-right font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                      R$ {item.custoPorKm.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}