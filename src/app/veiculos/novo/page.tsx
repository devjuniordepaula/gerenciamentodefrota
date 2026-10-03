'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { 
  Car, FileText, MapPin, DollarSign, Upload, 
  Save, ArrowLeft, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NovoVeiculoPage() {
  const router = useRouter(); 
  const [isSaving, setIsSaving] = useState(false);

  // Ação de Salvar: Simula delay da API/Supabase e retorna à listagem
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push('/veiculos'); 
    }, 1500);
  };

  // Ação de Cancelar/Voltar: Retorna imediatamente para a tabela de veículos
  const handleCancel = () => {
    router.push('/veiculos');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10 max-w-4xl mx-auto pt-4">
      
      {/* HEADER FIXO COM BOTÕES DE ROTEAMENTO ATIVOS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleCancel}
            className="h-9 w-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Voltar para a lista de veículos"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Cadastrar Novo Veículo</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Preencha os dados estruturados para integrar o ativo à frota.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all min-w-[140px]">
            {isSaving ? 'Salvando...' : <><Save className="w-4 h-4 mr-2" /> Salvar Veículo</>}
          </Button>
        </div>
      </div>

      {/* FORMULÁRIO EM ABAS (CHUNKING COGNITIVO) */}
      <Tabs defaultValue="identificacao" className="w-full">
        
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-8">
          <TabsTrigger value="identificacao" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm py-2.5 rounded-lg text-sm transition-all">
            <Car className="w-4 h-4 mr-2" /> Identificação
          </TabsTrigger>
          <TabsTrigger value="operacao" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm py-2.5 rounded-lg text-sm transition-all">
            <MapPin className="w-4 h-4 mr-2" /> Operação
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-400 data-[state=active]:shadow-sm py-2.5 rounded-lg text-sm transition-all">
            <DollarSign className="w-4 h-4 mr-2" /> Financeiro
          </TabsTrigger>
          <TabsTrigger value="documentacao" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-rose-600 dark:data-[state=active]:text-rose-400 data-[state=active]:shadow-sm py-2.5 rounded-lg text-sm transition-all">
            <ShieldCheck className="w-4 h-4 mr-2" /> Documentos
          </TabsTrigger>
        </TabsList>

        {/* --- ABA 1: IDENTIFICAÇÃO --- */}
        <TabsContent value="identificacao" className="focus-visible:outline-none animate-in slide-in-from-left-2 duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs">
            <div className="max-w-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Placa (Chave Principal) <span className="text-rose-500">*</span></label>
                  <Input placeholder="ABC-1234" className="h-11 uppercase bg-slate-50 dark:bg-slate-950/50 text-lg tracking-widest border-slate-200 dark:border-slate-800" maxLength={8} />
                  <p className="text-[11px] text-slate-500">Usada como chave de relacionamento nas demais abas.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Veículo (Marca/Modelo) <span className="text-rose-500">*</span></label>
                  <Input placeholder="Ex: Scania R450" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ano/Modelo</label>
                  <Input placeholder="2023/2024" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tipo de Veículo</label>
                  <select className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione...</option>
                    <option value="passeio">Passeio (Leve)</option>
                    <option value="utilitario">Utilitário (Vans/Caminhonetes)</option>
                    <option value="caminhao_leve">Caminhão Leve</option>
                    <option value="caminhao_pesado">Caminhão Pesado / Carreta</option>
                    <option value="moto">Motocicleta</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Categoria</label>
                  <select className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione...</option>
                    <option value="diretoria">Frota Executiva / Diretoria</option>
                    <option value="operacional">Operacional / Logística</option>
                    <option value="comercial">Equipe Comercial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- ABA 2: OPERAÇÃO --- */}
        <TabsContent value="operacao" className="focus-visible:outline-none animate-in slide-in-from-left-2 duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs">
            <div className="max-w-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status Atual <span className="text-rose-500">*</span></label>
                  <select className="w-full h-11 px-3 rounded-md border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-900/10 text-sm font-medium text-emerald-700 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="ativo">Ativo (Rodando)</option>
                    <option value="manutencao">Em Manutenção</option>
                    <option value="inativo">Inativo / Parado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cidade / Localização</label>
                  <select className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100">
                    <option value="">Selecione a cidade...</option>
                    <option value="fortaleza">Fortaleza - CE (Matriz)</option>
                    <option value="sao_paulo">São Paulo - SP</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Setor</label>
                  <select className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100">
                    <option value="">Selecione o setor...</option>
                    <option value="logistica">Logística Avançada</option>
                    <option value="vendas">Vendas Externas</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contrato</label>
                  <select className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100">
                    <option value="">Frota Própria (Sem Contrato)</option>
                    <option value="loca_localiza">Locação - Localiza</option>
                    <option value="loca_movida">Locação - Movida</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Motorista</label>
                  <Input placeholder="Nome do motorista" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Responsável Legal</label>
                  <Input placeholder="Nome do responsável" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- ABA 3: FINANCEIRO --- */}
        <TabsContent value="financeiro" className="focus-visible:outline-none animate-in slide-in-from-left-2 duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs">
            <div className="max-w-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Valor de Aquisição</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500 font-medium">R$</span>
                    <Input type="number" placeholder="0,00" className="h-11 pl-10 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Data de Compra</label>
                  <Input type="date" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Km na Compra</label>
                  <div className="relative">
                    <Input type="number" placeholder="Ex: 0" className="h-11 pr-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800" />
                    <span className="absolute right-3 top-3 text-slate-500 text-sm">km</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Responsável Financeiro</label>
                  <select className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100">
                    <option value="">Selecione o responsável...</option>
                    <option value="matriz">Matriz (Geral)</option>
                    <option value="operacoes">Operações (Deduzido)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- ABA 4: DOCUMENTAÇÃO E OBSERVAÇÕES --- */}
        <TabsContent value="documentacao" className="focus-visible:outline-none animate-in slide-in-from-left-2 duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs">
            <div className="max-w-2xl space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Renavam</label>
                  <Input placeholder="Código numérico" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chassi</label>
                  <Input placeholder="17 caracteres" className="h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 font-mono uppercase" />
                </div>
              </div>

              {/* UPLOAD DE ARQUIVO CRLV */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">CRLV (Arquivo)</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30 rounded-xl p-8 text-center hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                  <div className="mx-auto w-12 h-12 bg-white dark:bg-slate-800 shadow-sm text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Arraste o arquivo do CRLV para cá</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4">PDF, PNG ou JPG. Máximo de 5MB.</p>
                  <Button variant="outline" size="sm" className="bg-white dark:bg-slate-800">Selecionar Arquivo</Button>
                </div>
              </div>

              {/* OBSERVAÇÃO */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Observação</label>
                <textarea 
                  className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors"
                  placeholder="Detalhes adicionais, restrições ou observações sobre o veículo..."
                />
              </div>

            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}