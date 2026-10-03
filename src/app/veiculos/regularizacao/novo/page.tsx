'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Upload, Save, ArrowLeft, Calendar, DollarSign, FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock de placas já cadastradas na base de veículos para alimentar a lista suspensa
const placasCadastradasMock = [
  { placa: 'ABC-1234', modelo: 'Volvo FH 540' },
  { placa: 'XYZ-9876', modelo: 'Scania R450' },
  { placa: 'DEF-5544', modelo: 'VW Delivery 11.180' },
  { placa: 'GHI-3322', modelo: 'Mercedes-Benz Atego' },
];

export default function NovoRegularizacaoPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [placaSelecionada, setPlacaSelecionada] = useState('');

  // Encontra o modelo automaticamente ao selecionar a placa
  const veiculoAtual = placasCadastradasMock.find(v => v.placa === placaSelecionada);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push('/veiculos/regularizacao');
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/veiculos/regularizacao');
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
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Lançamento de Regularização / OBRIGAÇÕES</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Vincule IPVA, Licenciamento e Seguros utilizando a placa cadastrada na frota.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleCancel} className="text-slate-600 dark:text-slate-400">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md min-w-[140px]">
            {isSaving ? 'Salvando...' : <><Save className="w-4 h-4 mr-2" /> Salvar Registro</>}
          </Button>
        </div>
      </div>

      {/* SELEÇÃO DA PLACA (CHAVE VINCULADA) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-500" /> Seleção do Ativo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ano Exercício <span className="text-rose-500">*</span></label>
            <Input placeholder="2026" defaultValue="2026" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 font-mono" />
          </div>
        </div>
      </div>

      {/* ABAS DE OBRIGAÇÕES */}
      <Tabs defaultValue="ipva" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-6">
          <TabsTrigger value="ipva" className="py-2.5 rounded-lg text-sm">IPVA</TabsTrigger>
          <TabsTrigger value="licenciamento" className="py-2.5 rounded-lg text-sm">Licenciamento</TabsTrigger>
          <TabsTrigger value="arce" className="py-2.5 rounded-lg text-sm">Licença ARCE</TabsTrigger>
          <TabsTrigger value="seguro" className="py-2.5 rounded-lg text-sm">Seguro & Outros</TabsTrigger>
        </TabsList>

        {/* IPVA */}
        <TabsContent value="ipva" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Controle de IPVA</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Valor IPVA</label>
                <Input type="number" placeholder="0,00" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tipo de Pagamento</label>
                <select className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100">
                  <option value="cota_unica">Cota Única (À vista)</option>
                  <option value="parcelado">Parcelado</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vencimento IPVA</label>
                <Input type="date" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500" />
              </div>
            </div>
            {/* Upload IPVA */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Comprovante / Guia IPVA (Arquivo)</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                <Upload className="w-5 h-5 mx-auto text-blue-500 mb-2" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Clique para anexar o boleto ou comprovante</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* LICENCIAMENTO */}
        <TabsContent value="licenciamento" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Controle de Licenciamento Anual</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Valor Licenciamento</label>
                <Input type="number" placeholder="0,00" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vencimento Licenciamento</label>
                <Input type="date" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500" />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Documento de Licenciamento (Arquivo)</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                <Upload className="w-5 h-5 mx-auto text-blue-500 mb-2" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Anexar CRLV digital atualizado</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ARCE */}
        <TabsContent value="arce" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Licença da ARCE (Regulatório Estadual)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vigência Licença da Arce</label>
                <Input type="date" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500" />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Licença da Arce (Arquivo)</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                <Upload className="w-5 h-5 mx-auto text-blue-500 mb-2" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Anexar documento PDF da ARCE</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* SEGURO E OBS */}
        <TabsContent value="seguro" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Seguro da Frota & Observações</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Valor Seguro</label>
                <Input type="number" placeholder="0,00" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Data de Vencimento</label>
                <Input type="date" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vigência Seguro</label>
                <Input placeholder="Ex: 12 meses" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Seguro (Arquivo da Apólice)</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                <Upload className="w-5 h-5 mx-auto text-blue-500 mb-2" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Anexar apólice de seguro</span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Observações Legais</label>
              <textarea 
                className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Observações sobre prazos, restrições ou apólices..."
              />
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}