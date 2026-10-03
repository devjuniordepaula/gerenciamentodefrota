'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertTriangle, Upload, Save, ArrowLeft, Calendar, DollarSign, FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lista simulada de placas vindas do cadastro central de veículos
const placasCadastradasMock = [
  { placa: 'ABC-1234', modelo: 'Volvo FH 540' },
  { placa: 'XYZ-9876', modelo: 'Scania R450' },
  { placa: 'DEF-5544', modelo: 'VW Delivery 11.180' },
  { placa: 'GHI-3322', modelo: 'Mercedes-Benz Atego' },
];

export default function NovaMultaPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [placaSelecionada, setPlacaSelecionada] = useState('');
  const [valorOriginal, setValorOriginal] = useState<number>(0);

  // Fórmula automática de Desconto de 40% (SNE)
  const valorComDesconto = (valorOriginal * 0.6).toFixed(2);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push('/veiculos/multas');
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/veiculos/multas');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10 max-w-4xl mx-auto pt-4">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleCancel}
            className="h-9 w-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Lançar Nova Multa</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Vincule a infração à placa cadastrada e gerencie prazos de indicação.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleCancel} className="text-slate-600 dark:text-slate-400">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md min-w-[140px]">
            {isSaving ? 'Salvando...' : <><Save className="w-4 h-4 mr-2" /> Salvar Multa</>}
          </Button>
        </div>
      </div>

      {/* SELEÇÃO DA PLACA (VINCULADA AO CADASTRO) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" /> Identificação do Veículo Autuado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Placa (Lista Cadastrada) <span className="text-rose-500">*</span></label>
            <select 
              value={placaSelecionada}
              onChange={(e) => setPlacaSelecionada(e.target.value)}
              className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione a placa cadastrada...</option>
              {placasCadastradasMock.map((v) => (
                <option key={v.placa} value={v.placa}>
                  {v.placa} — {v.modelo}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tipo de Infração <span className="text-rose-500">*</span></label>
            <Input placeholder="Ex: Excesso de velocidade / Farol apagado" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
          </div>
        </div>
      </div>

      {/* ABAS DE DETALHAMENTO DA MULTA */}
      <Tabs defaultValue="detalhes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 h-auto p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-6">
          <TabsTrigger value="detalhes" className="py-2.5 rounded-lg text-sm">Dados da Infração</TabsTrigger>
          <TabsTrigger value="financeiro" className="py-2.5 rounded-lg text-sm">Valores & Pagamento</TabsTrigger>
          <TabsTrigger value="indicacao" className="py-2.5 rounded-lg text-sm">Indicação & Prazos</TabsTrigger>
        </TabsList>

        {/* DETALHES */}
        <TabsContent value="detalhes" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Local e Órgão Autuador</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Condutor</label>
                <Input placeholder="Nome do motorista" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Data da Infração</label>
                <Input type="date" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Local da Infração</label>
                <Input placeholder="Ex: Rodovia BR-116, km 20" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Setor / Secretaria</label>
                <Input placeholder="Ex: Logística / Secretaria de Transportes" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Órgão Autuador</label>
                <Input placeholder="Ex: PRF / DETRAN / DETRAVI" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gravidade / Pontos</label>
                <select className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100">
                  <option value="3">Leve (3 pontos)</option>
                  <option value="4">Média (4 pontos)</option>
                  <option value="5">Grave (5 pontos)</option>
                  <option value="7">Gravíssima (7 pontos)</option>
                </select>
              </div>
            </div>

            {/* UPLOAD ARQUIVO DA MULTA */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Arquivo da Multa (Notificação)</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                <Upload className="w-5 h-5 mx-auto text-blue-500 mb-2" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Anexar notificação de autuação (PDF/Imagem)</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* FINANCEIRO */}
        <TabsContent value="financeiro" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Valores e Status de Pagamento</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Valor Original</label>
                <Input 
                  type="number" 
                  placeholder="0,00" 
                  value={valorOriginal || ''}
                  onChange={(e) => setValorOriginal(Number(e.target.value))}
                  className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Valor com Desconto (40% SNE)</label>
                <Input 
                  readOnly 
                  value={valorComDesconto} 
                  className="h-11 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 font-mono font-bold text-emerald-600" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Data de Vencimento</label>
                <Input type="date" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status do Pagamento</label>
                <select className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100">
                  <option value="Pendente">Pendente</option>
                  <option value="Pago">Pago</option>
                  <option value="Em Recurso">Em Recurso</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ressarcimento / Cobrança</label>
                <select className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100">
                  <option value="Não Aplicável">Não Aplicável</option>
                  <option value="Descontar em Folha">Descontar em Folha do Condutor</option>
                  <option value="Pago pela Empresa">Pago pela Empresa</option>
                </select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* INDICAÇÃO E PRAZOS */}
        <TabsContent value="indicacao" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Indicação de Condutor e Defesa Prévia</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Indicação Realizada?</label>
                <select className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100">
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Prazo Indicação Condutor</label>
                <Input type="date" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recurso / Defesa Prévia?</label>
                <select className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100">
                  <option value="Não">Não</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Deferido">Deferido</option>
                  <option value="Indeferido">Indeferido</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Observações</label>
              <textarea 
                className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Detalhes sobre a autuação, justificativa do motorista ou andamento de recurso..."
              />
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}