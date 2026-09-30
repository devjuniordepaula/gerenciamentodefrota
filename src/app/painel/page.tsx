'use client'

import React, { useMemo } from 'react';
import { 
  AlertTriangle, Truck, Receipt, Wrench, 
  TrendingDown, TrendingUp, ArrowRight, Plus, 
  CalendarClock, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Link from 'next/link';

// --- MOCK DETERMINÍSTICO PARA O DASHBOARD ---
const kpisMock = {
  frotaTotal: 22,
  frotaParada: 3,
  custoMesAtual: 14500.50,
  variacaoCusto: -5.2, // Redução de 5.2% em relação ao mês anterior
  alertasCriticos: 4
};

const alertasMock = [
  { id: '1', tipo: 'manutencao', nivel: 'critico', titulo: 'Troca de Óleo Atrasada', veiculo: 'Volvo FH 540 (ABC-1234)', data: 'Venceu há 2 dias' },
  { id: '2', tipo: 'documento', nivel: 'critico', titulo: 'IPVA Próximo do Vencimento', veiculo: 'VW Delivery (XYZ-9876)', data: 'Vence em 5 dias' },
  { id: '3', tipo: 'operacao', nivel: 'alerta', titulo: 'Veículo Ocioso', veiculo: 'Scania R450 (QWE-5555)', data: 'Parado há 4 dias' },
  { id: '4', tipo: 'despesa', nivel: 'alerta', titulo: 'Orçamento Estourando', veiculo: 'Centro de Custo: Frota Leve', data: '92% consumido' },
];

const graficoCustosMock = [
  { name: 'Seg', valor: 1200 },
  { name: 'Ter', valor: 850 },
  { name: 'Qua', valor: 2100 },
  { name: 'Qui', valor: 400 },
  { name: 'Sex', valor: 3500 }, // Pico de oficina
  { name: 'Sáb', valor: 150 },
  { name: 'Dom', valor: 0 },
];

// O NEXT.JS EXIGE ESTE EXPORT DEFAULT PARA RENDERIZAR A PÁGINA
export default function PainelPage() {
  const formatarMoeda = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* HEADER & AÇÕES RÁPIDAS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Olá, Gestor 👋</h2>
          <p className="text-sm text-slate-500">Aqui está o resumo da sua operação hoje.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/despesas">
            <Button variant="outline" className="bg-white hover:bg-slate-50 text-slate-700 shadow-sm border-slate-200">
              <Receipt className="w-4 h-4 mr-2 text-slate-400" /> Lançar Despesa
            </Button>
          </Link>
          <Link href="/veiculos">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> Novo Veículo
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 KPIS PRINCIPAIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Veículos Ativos */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase">Frota Ativa</CardTitle>
            <Truck className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-slate-900">{kpisMock.frotaTotal - kpisMock.frotaParada}</div>
            <p className="text-xs text-slate-500 mt-1">de {kpisMock.frotaTotal} veículos</p>
          </CardContent>
        </Card>

        {/* Veículos Parados/Oficina */}
        <Card className={`${kpisMock.frotaParada > 0 ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 bg-white'} shadow-xs`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase">Em Oficina</CardTitle>
            <Wrench className={`w-4 h-4 ${kpisMock.frotaParada > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className={`text-2xl font-bold ${kpisMock.frotaParada > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {kpisMock.frotaParada}
            </div>
            <p className="text-xs text-slate-500 mt-1">Improdutivos hoje</p>
          </CardContent>
        </Card>

        {/* Custo do Mês */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase">Despesas (Mês)</CardTitle>
            <Receipt className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-slate-900">{formatarMoeda(kpisMock.custoMesAtual).split(',')[0]}</div>
            <p className="text-xs mt-1 flex items-center gap-1 font-medium">
              {kpisMock.variacaoCusto < 0 ? (
                <span className="text-emerald-600 flex items-center"><TrendingDown className="w-3 h-3 mr-0.5"/> {Math.abs(kpisMock.variacaoCusto)}%</span>
              ) : (
                <span className="text-rose-600 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5"/> {kpisMock.variacaoCusto}%</span>
              )}
              <span className="text-slate-500 font-normal">vs. mês passado</span>
            </p>
          </CardContent>
        </Card>

        {/* Alertas Críticos */}
        <Card className={`${kpisMock.alertasCriticos > 0 ? 'border-rose-200 bg-rose-50/50' : 'border-slate-200 bg-emerald-50/30'} shadow-xs`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className={`text-xs font-semibold uppercase ${kpisMock.alertasCriticos > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              Atenção Exigida
            </CardTitle>
            {kpisMock.alertasCriticos > 0 ? <AlertTriangle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className={`text-2xl font-bold ${kpisMock.alertasCriticos > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {kpisMock.alertasCriticos === 0 ? 'Tudo OK' : kpisMock.alertasCriticos}
            </div>
            <p className={`text-xs mt-1 ${kpisMock.alertasCriticos > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
              {kpisMock.alertasCriticos > 0 ? 'Pendências críticas' : 'Frota operando 100%'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ÁREA DE CONTEÚDO DIVIDIDA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA: Alertas */}
        <Card className="border-slate-200 shadow-xs xl:col-span-1 flex flex-col order-1 xl:order-2">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" /> Central de Ação
            </CardTitle>
            <CardDescription className="text-xs">O que precisa ser resolvido hoje.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="divide-y divide-slate-100">
              {alertasMock.map((alerta) => (
                <div key={alerta.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${alerta.nivel === 'critico' ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{alerta.titulo}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{alerta.veiculo}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <CalendarClock className="w-3 h-3" /> {alerta.data}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2">
                        Resolver
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 mt-auto">
              <Button variant="ghost" className="w-full text-sm text-slate-500 hover:text-slate-700">
                Ver todos os alertas <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* COLUNA DIREITA: Gráfico Financeiro Rápido */}
        <Card className="border-slate-200 shadow-xs xl:col-span-2 flex flex-col order-2 xl:order-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-500" /> Ritmo de Gastos (Últimos 7 dias)
            </CardTitle>
            <CardDescription className="text-xs">Acompanhamento diário de custos operacionais e manutenções.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[250px] p-4 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graficoCustosMock} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  formatter={(value: any) => formatarMoeda(Number(value) || 0)}                />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                  {graficoCustosMock.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.valor > 2000 ? '#f43f5e' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}