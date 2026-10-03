'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wrench, Upload, Save, ArrowLeft, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock de placas vindas do cadastro central para evitar digitação manual
const placasCadastradasMock = [
  { placa: 'ABC-1234', modelo: 'Volvo FH 540', kmAtual: 45000 },
  { placa: 'XYZ-9876', modelo: 'Scania R450', kmAtual: 180000 },
  { placa: 'DEF-5544', modelo: 'VW Delivery 11.180', kmAtual: 62000 },
];

export default function NovoPlanoManutencaoPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [tipoManutencao, setTipoManutencao] = useState<'preventiva' | 'corretiva'>('preventiva');
  const [placaSelecionada, setPlacaSelecionada] = useState('');
  
  // Custos da corretiva para cálculo automático
  const [custoPecas, setCustoPecas] = useState<number>(0);
  const [custoMaoObra, setCustoMaoObra] = useState<number>(0);
  const custoTotal = (custoPecas + custoMaoObra).toFixed(2);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push('/veiculos/planos');
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/planos');
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
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Registrar Manutenção</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Selecione o tipo de atendimento e preencha os parâmetros operacionais.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleCancel} className="text-slate-600 dark:text-slate-400">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md min-w-[140px]">
            {isSaving ? 'Salvando...' : <><Save className="w-4 h-4 mr-2" /> Salvar Ordem</>}
          </Button>
        </div>
      </div>

      {/* SELETOR DE TIPO (CONDICIONAL / SWITCH INTELIGENTE) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-500" /> Classificação do Atendimento
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setTipoManutencao('preventiva')}
            className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 
              ${tipoManutencao === 'preventiva' 
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300 font-bold shadow-xs' 
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400'}`}
          >
            <CheckCircle2 className={`w-5 h-5 ${tipoManutencao === 'preventiva' ? 'text-blue-600' : 'text-slate-400'}`} />
            <div>
              <p className="text-sm">Manutenção Preventiva</p>
              <p className="text-[11px] font-normal opacity-80">Revisões programadas, troca de óleo e itens periódicos.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTipoManutencao('corretiva')}
            className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 
              ${tipoManutencao === 'corretiva' 
                ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 font-bold shadow-xs' 
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400'}`}
          >
            <ShieldAlert className={`w-5 h-5 ${tipoManutencao === 'corretiva' ? 'text-amber-600' : 'text-slate-400'}`} />
            <div>
              <p className="text-sm">Manutenção Corretiva</p>
              <p className="text-[11px] font-normal opacity-80">Reparos inesperados, falhas mecânicas e peças quebradas.</p>
            </div>
          </button>
        </div>

        {/* SELEÇÃO DA PLACA (VINCULADA AO CADASTRO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Placa (Vinculada ao Cadastro) <span className="text-rose-500">*</span></label>
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
        </div>
      </div>

      {/* --- FORMULÁRIO CONDICIONAL: PREVENTIVA (Table_4) --- */}
      {tipoManutencao === 'preventiva' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
          <h4 className="font-bold text-slate-800 dark:text-slate-100">Parâmetros da Revisão Preventiva</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Item de Controle</label>
              <Input placeholder="Ex: Troca de Correia / Óleo" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Última Troca (KM)</label>
              <Input type="number" placeholder="Ex: 40000" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Intervalo Recomendado (KM)</label>
              <Input type="number" placeholder="Ex: 10000" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Data da Última Manutenção</label>
              <Input type="date" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Custo Total (Peças + Mão de Obra)</label>
              <Input type="number" placeholder="0,00" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Oficina / Fornecedor</label>
              <Input placeholder="Nome da oficina" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Setor no Momento</label>
              <Input placeholder="Ex: Logística" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Motorista no Momento</label>
              <Input placeholder="Nome do condutor" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">NF ou Comprovante (Arquivo)</label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-100 transition-colors">
              <Upload className="w-5 h-5 mx-auto text-blue-500 mb-2" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Anexar nota fiscal da revisão</span>
            </div>
          </div>
        </div>
      )}

      {/* --- FORMULÁRIO CONDICIONAL: CORRETIVA (Table_5) --- */}
      {tipoManutencao === 'corretiva' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
          <h4 className="font-bold text-slate-800 dark:text-slate-100">Ordem de Serviço Corretiva</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">KM na Manutenção</label>
              <Input type="number" placeholder="Ex: 120000" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Data de Chegada</label>
              <Input type="date" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Data de Saída</label>
              <Input type="date" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Custo Peças</label>
              <Input 
                type="number" 
                placeholder="0,00" 
                value={custoPecas || ''}
                onChange={(e) => setCustoPecas(Number(e.target.value))}
                className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Custo Mão de Obra</label>
              <Input 
                type="number" 
                placeholder="0,00" 
                value={custoMaoObra || ''}
                onChange={(e) => setCustoMaoObra(Number(e.target.value))}
                className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Custo Total (Soma Automática)</label>
              <Input 
                readOnly 
                value={custoTotal} 
                className="h-11 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 font-mono font-bold text-amber-600" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Categoria do Sistema</label>
              <Input placeholder="Ex: Motor, Suspensão, Elétrica, Freios" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Causa Raiz</label>
              <Input placeholder="Ex: Desgaste natural / Defeito de peça" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Descrição da Corretiva</label>
            <textarea 
              className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Descreva o serviço executado, peças trocadas e observações da oficina..."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">NF ou Comprovante da Corretiva (Arquivo)</label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-100 transition-colors">
              <Upload className="w-5 h-5 mx-auto text-blue-500 mb-2" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Anexar nota fiscal ou recibo</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}