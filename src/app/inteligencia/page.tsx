'use client'

import React, { useMemo } from 'react';
import { 
  Sparkles, ShieldAlert, TrendingDown, 
  Wrench, AlertTriangle, CheckCircle2, Car, BarChart3, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// --- DADOS DERIVADOS DOS VEÍCULOS JÁ CADASTRADOS (MOCK INTELIGENTE) ---
const gerarDadosInteligentes = () => [
  { 
    id: '1', 
    modelo: 'Volvo FH 540', 
    placa: 'ABC-1234', 
    ano: 2022, 
    kmAtual: 145000, 
    fipeEstimada: 480000, 
    probabilidadeQuebra: 84, 
    componenteCritico: 'Sistema de Injeção / Filtros', 
    statusRisco: 'Crítico',
    diasEstimadosParaFalha: 12
  },
  { 
    id: '2', 
    modelo: 'Scania R450', 
    placa: 'XYZ-9876', 
    ano: 2021, 
    kmAtual: 180000, 
    fipeEstimada: 420000, 
    probabilidadeQuebra: 62, 
    componenteCritico: 'Correia Dentada / Alternador', 
    statusRisco: 'Moderado',
    diasEstimadosParaFalha: 25
  },
  { 
    id: '3', 
    modelo: 'VW Delivery 11.180', 
    placa: 'DEF-5544', 
    ano: 2023, 
    kmAtual: 45000, 
    fipeEstimada: 250000, 
    probabilidadeQuebra: 15, 
    componenteCritico: 'Revisão Básica em Dia', 
    statusRisco: 'Baixo',
    diasEstimadosParaFalha: 90
  },
  { 
    id: '4', 
    modelo: 'Mercedes-Benz Atego', 
    placa: 'GHI-3322', 
    ano: 2020, 
    kmAtual: 210000, 
    fipeEstimada: 290000, 
    probabilidadeQuebra: 91, 
    componenteCritico: 'Embreagem e Caixa de Câmbio', 
    statusRisco: 'Crítico',
    diasEstimadosParaFalha: 5
  },
];

export default function InteligenciaFrotaPage() {
  const frotaInteligente = useMemo(() => gerarDadosInteligentes(), []);

  // KPIs calculados deterministicamente com base na frota
  const kpis = useMemo(() => {
    const criticos = frotaInteligente.filter(v => v.statusRisco === 'Crítico').length;
    const patrimonioTotal = frotaInteligente.reduce((acc, v) => acc + v.fipeEstimada, 0);
    const economiaEstimadaOficina = 12450.00; // Simulação de 30% de economia baseada em manutenções evitadas

    return {
      totalAnalisados: frotaInteligente.length,
      veiculosEmRisco: criticos,
      patrimonioFipe: patrimonioTotal,
      economiaOficina: economiaEstimadaOficina
    };
  }, [frotaInteligente]);

  const formatarMoeda = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900 font-semibold text-xs">
              Módulo Avançado • Inteligência Operacional
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Previsão de Falhas & Tabela FIPE
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Análise preditiva determinística gerada a partir dos dados cadastrados na sua frota.
          </p>
        </div>
      </div>

      {/* CARDS DE KPI / VALOR AGREGADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Patrimônio FIPE (Frota)</CardTitle>
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{formatarMoeda(kpis.patrimonioFipe)}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Valor de mercado atualizado</p>
          </CardContent>
        </Card>

        <Card className="border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-900/10 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase">Veículos em Risco (30 dias)</CardTitle>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{kpis.veiculosEmRisco} de {kpis.totalAnalisados}</div>
            <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">Exigem intervenção imediata</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-900/10 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">Economia Média (Oficina)</CardTitle>
            <TrendingDown className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatarMoeda(kpis.economiaOficina)}</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">~30% de redução em corretivas</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Confiabilidade Geral</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">78.5%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Índice de saúde da frota</p>
          </CardContent>
        </Card>
      </div>

      {/* SEÇÃO PRINCIPAL: RELATÓRIO DE PROBABILIDADE DE QUEBRA */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Sparkles className="w-5 h-5 text-amber-500" /> Probabilidade de Quebra nos Próximos 30 Dias
          </CardTitle>
          <CardDescription className="dark:text-slate-400">
            Ranking de criticidade baseado na quilometragem atual, histórico de manutenções e padrão do modelo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {frotaInteligente.map((veiculo) => {
              const corBarra = veiculo.probabilidadeQuebra > 80 ? 'bg-rose-500' : veiculo.probabilidadeQuebra > 50 ? 'bg-amber-500' : 'bg-emerald-500';
              const badgeCor = veiculo.statusRisco === 'Crítico' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' : veiculo.statusRisco === 'Moderado' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';

              return (
                <div key={veiculo.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Dados do Veículo */}
                  <div className="flex items-start gap-3 min-w-[250px]">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 mt-0.5">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{veiculo.modelo}</span>
                        <Badge variant="outline" className="font-mono text-[10px] bg-white dark:bg-slate-800 dark:border-slate-700">{veiculo.placa}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Ano {veiculo.ano} • {veiculo.kmAtual.toLocaleString('pt-BR')} km rodados • FIPE: <strong className="text-slate-700 dark:text-slate-300">{formatarMoeda(veiculo.fipeEstimada)}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Peça Crítica Identificada */}
                  <div className="flex-1 max-w-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Peça Crítica em Alerta</span>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-500" /> {veiculo.componenteCritico}
                    </span>
                  </div>

                  {/* Barra de Probabilidade */}
                  <div className="w-full md:w-48 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600 dark:text-slate-400">Risco de Falha</span>
                      <span className={veiculo.probabilidadeQuebra > 80 ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}>
                        {veiculo.probabilidadeQuebra}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${corBarra} transition-all duration-500`} style={{ width: `${veiculo.probabilidadeQuebra}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 text-right">Falha estimada em ~{veiculo.diasEstimadosParaFalha} dias</p>
                  </div>

                  {/* Status & Ação */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
                    <Badge variant="outline" className={`font-medium border-0 ${badgeCor}`}>
                      {veiculo.statusRisco}
                    </Badge>
                    <Button size="sm" variant="outline" className="h-8 text-xs bg-white dark:bg-slate-800 dark:border-slate-700">
                      Agendar Revisão <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>

                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}