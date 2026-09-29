'use client'

import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Truck, CheckCircle, XCircle, 
  ChevronLeft, ChevronRight, Filter, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// --- MOCK DETERMINÍSTICO (Sem Math.random para evitar erro de Hidratação SSR) ---
const gerarVeiculosMock = () => {
  const frota = [];
  for (let i = 1; i <= 22; i++) {
    frota.push({
      id: i.toString(),
      prefixo: `FROTA-${String(i).padStart(3, '0')}`,
      // Usando matemática previsível no lugar de random()
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

const estadoInicialFormulario = {
  prefixo: '', placa: '', marca: '', modelo: '', anoModelo: '', 
  renavam: '', chassi: '', combustivel: '', status: 'Ativo'
};

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState(gerarVeiculosMock());
  
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'Todos' | 'Ativo' | 'Inativo'>('Todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 15;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [formData, setFormData] = useState(estadoInicialFormulario);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = (name === 'placa' || name === 'prefixo' || name === 'chassi') ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const iniciarSalvamento = () => setIsAlertOpen(true);

  const confirmarCadastro = () => {
    const novoVeiculo = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      anoModelo: parseInt(formData.anoModelo) || new Date().getFullYear(),
    };
    setVeiculos(prev => [novoVeiculo, ...prev]);
    setIsAlertOpen(false);
    setIsModalOpen(false);
    setFormData(estadoInicialFormulario);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Frota de Veículos</h2>
          <p className="text-sm text-slate-500">Gerencie cadastros, status e documentação da frota.</p>
        </div>
        
        {/* BOTÃO FORA DO MODAL (Resolve o erro de Nested Buttons) */}
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Cadastrar Veículo
        </Button>
      </div>

      {/* === MODAL DE CADASTRO === */}
      {/* O DialogTrigger foi removido, usamos apenas open e onOpenChange */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Novo Veículo</DialogTitle>
            <DialogDescription>
              Preencha os dados do veículo divididos por categorias.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="geral" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="geral" className="flex items-center gap-2">
                <Truck className="w-4 h-4" /> Dados Principais
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Documentação
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="geral" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Prefixo (Frota)</label>
                  <Input name="prefixo" placeholder="Ex: FRT-001" value={formData.prefixo} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Placa</label>
                  <Input name="placa" placeholder="ABC-1234" value={formData.placa} onChange={handleInputChange} maxLength={8} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Marca</label>
                  <Input name="marca" placeholder="Ex: Volvo" value={formData.marca} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Modelo</label>
                  <Input name="modelo" placeholder="Ex: FH 540" value={formData.modelo} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Ano Modelo</label>
                  <Input name="anoModelo" type="number" placeholder="Ex: 2024" value={formData.anoModelo} onChange={handleInputChange} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Renavam</label>
                  <Input name="renavam" placeholder="Apenas números" value={formData.renavam} onChange={handleInputChange} type="number" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Chassi</label>
                  <Input name="chassi" placeholder="Código do chassi" value={formData.chassi} onChange={handleInputChange} maxLength={17} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Combustível</label>
                  <Select value={formData.combustivel} onValueChange={(val) => handleSelectChange('combustivel', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diesel S10">Diesel S10</SelectItem>
                      <SelectItem value="Diesel S500">Diesel S500</SelectItem>
                      <SelectItem value="Gasolina">Gasolina</SelectItem>
                      <SelectItem value="Etanol/Gasolina">Flex (Etanol/Gasolina)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status Inicial</label>
                  <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo (Rodando)</SelectItem>
                      <SelectItem value="Inativo">Inativo (Oficina/Parado)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 border-t pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={iniciarSalvamento}>
              Salvar Veículo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* === FIM DO MODAL === */}

      {/* === ALERT DIALOG (DUPLA CONFIRMAÇÃO) === */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cadastro?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a cadastrar o veículo Placa <strong>{formData.placa}</strong> na base de dados. Confirma que as informações estão corretas?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Revisar Dados</AlertDialogCancel>
            <AlertDialogAction className="bg-blue-600 hover:bg-blue-700 text-white" onClick={confirmarCadastro}>
              Sim, Cadastrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* === FIM DO ALERT DIALOG === */}

      {/* CARDS DE KPI */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Total Cadastrado</CardTitle>
            <Truck className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-slate-900">{kpis.total}</div></CardContent>
        </Card>
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Habilitados</CardTitle>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-emerald-600">{kpis.ativos}</div></CardContent>
        </Card>
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Desabilitados</CardTitle>
            <XCircle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-rose-600">{kpis.inativos}</div></CardContent>
        </Card>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input 
            placeholder="Buscar por placa, prefixo ou modelo..." 
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-600" 
            value={busca} onChange={(e) => setBusca(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <div className="flex rounded-md shadow-sm">
            {(['Todos', 'Ativo', 'Inativo'] as const).map((status) => (
              <button key={status} onClick={() => setFiltroStatus(status)} className={`px-4 py-2 text-xs font-medium border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 transition-colors ${filtroStatus === status ? 'bg-slate-800 text-white border-slate-800 z-10' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABELA */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Prefixo</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Placa</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Modelo</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap text-center">Ano</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Combustível</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Renavam / Chassi</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center whitespace-nowrap">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {veiculosPaginados.map((v) => (
                <TableRow key={v.id} className="hover:bg-slate-50/60 transition-colors">
                  <TableCell className="font-mono font-medium text-slate-600">{v.prefixo}</TableCell>
                  <TableCell className="font-mono font-bold text-slate-900"><span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-xs">{v.placa}</span></TableCell>
                  <TableCell className="font-medium text-slate-900 whitespace-nowrap">{v.marca} {v.modelo}</TableCell>
                  <TableCell className="text-slate-600 font-mono text-center">{v.anoModelo}</TableCell>
                  <TableCell className="text-slate-600 text-xs">{v.combustivel}</TableCell>
                  <TableCell>
                    <div className="text-[11px] font-mono text-slate-500 flex flex-col">
                      <span><strong className="text-slate-700">R:</strong> {v.renavam}</span>
                      <span><strong className="text-slate-700">C:</strong> {v.chassi}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={v.status === 'Ativo' ? 'default' : 'secondary'} className={v.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}>
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <span className="text-xs text-slate-500 font-medium">
              Mostrando <strong className="text-slate-900">{(paginaAtual - 1) * itensPorPagina + 1}</strong> até <strong className="text-slate-900">{Math.min(paginaAtual * itensPorPagina, veiculosFiltrados.length)}</strong> de <strong className="text-slate-900">{veiculosFiltrados.length}</strong>
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} disabled={paginaAtual === 1}><ChevronLeft className="w-4 h-4" /></Button>
              <div className="text-xs font-medium text-slate-600 px-3">Página {paginaAtual} de {totalPaginas}</div>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} disabled={paginaAtual === totalPaginas}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}