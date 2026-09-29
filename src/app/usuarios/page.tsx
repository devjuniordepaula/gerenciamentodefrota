'use client'

import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, Users, UserCheck, UserX, 
  ChevronLeft, ChevronRight, ShieldAlert, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// --- MOCK DETERMINÍSTICO (Evita erro de hidratação) ---
const gerarUsuariosMock = () => {
  const usuarios = [];
  const nomes = ['Carlos', 'Mariana', 'Roberto', 'Ana', 'Felipe', 'Juliana', 'Marcos', 'Patricia', 'Diego', 'Luciana'];
  const sobrenomes = ['Silva', 'Souza', 'Oliveira', 'Santos', 'Pereira', 'Costa', 'Rodrigues', 'Almeida', 'Nascimento', 'Lima'];
  
  for (let i = 1; i <= 25; i++) {
    const nome = nomes[(i * 3) % nomes.length];
    const sobrenome = sobrenomes[(i * 7) % sobrenomes.length];
    
    usuarios.push({
      id: i.toString(),
      nome: `${nome} ${sobrenome}`,
      email: `${nome.toLowerCase()}.${sobrenome.toLowerCase()}@empresa.com`,
      role: i % 10 === 0 ? 'Administrador' : i % 3 === 0 ? 'Gestor' : 'Operador',
      status: i % 8 === 0 ? 'Inativo' : 'Ativo',
    });
  }
  return usuarios;
};

const estadoInicialFormulario = { nome: '', email: '', role: 'Operador', status: 'Ativo' };

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState(gerarUsuariosMock());
  
  // Estados de Filtro e Paginação
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'Todos' | 'Ativo' | 'Inativo'>('Todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 15;

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [formData, setFormData] = useState(estadoInicialFormulario);

  // --- KPIs ---
  const kpis = useMemo(() => ({
    total: usuarios.length,
    ativos: usuarios.filter(u => u.status === 'Ativo').length,
    inativos: usuarios.filter(u => u.status === 'Inativo').length,
  }), [usuarios]);

  // --- FILTRAGEM ---
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(u => {
      const matchBusca = 
        u.nome.toLowerCase().includes(busca.toLowerCase()) || 
        u.email.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = filtroStatus === 'Todos' || u.status === filtroStatus;
      return matchBusca && matchStatus;
    });
  }, [usuarios, busca, filtroStatus]);

  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  React.useEffect(() => { setPaginaAtual(1); }, [busca, filtroStatus]);

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const confirmarCadastro = () => {
    const novoUsuario = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setUsuarios(prev => [novoUsuario, ...prev]);
    setIsAlertOpen(false);
    setIsModalOpen(false);
    setFormData(estadoInicialFormulario);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Usuários & Permissões</h2>
          <p className="text-sm text-slate-500">Gerencie o acesso da sua equipe e os níveis de permissão no sistema.</p>
        </div>
        
        {/* BOTÃO FORA DO MODAL */}
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Convidar Usuário
        </Button>
      </div>

      {/* === MODAL DE CADASTRO === */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Convidar Novo Usuário</DialogTitle>
            <DialogDescription>
              Insira os dados do colaborador. Um e-mail de acesso será enviado automaticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nome Completo</label>
              <Input name="nome" placeholder="Ex: João da Silva" value={formData.nome} onChange={handleInputChange} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input name="email" type="email" placeholder="joao@empresa.com" className="pl-9" value={formData.email} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  Nível de Acesso <ShieldAlert className="w-3 h-3 text-slate-400" />
                </label>
                <Select value={formData.role} onValueChange={(val) => handleSelectChange('role', val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Gestor">Gestor</SelectItem>
                    <SelectItem value="Operador">Operador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo (Acesso Liberado)</SelectItem>
                    <SelectItem value="Inativo">Inativo (Bloqueado)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setIsAlertOpen(true)}>
              Enviar Convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === ALERT DIALOG (DUPLA CONFIRMAÇÃO) === */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Envio?</AlertDialogTitle>
            <AlertDialogDescription>
              Um convite será enviado para <strong>{formData.email}</strong> com acesso de <strong>{formData.role}</strong>. Tem certeza que os dados estão corretos?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Revisar</AlertDialogCancel>
            <AlertDialogAction className="bg-blue-600 hover:bg-blue-700 text-white" onClick={confirmarCadastro}>
              Sim, Enviar Convite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* CARDS DE KPI */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Total de Usuários</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-slate-900">{kpis.total}</div></CardContent>
        </Card>
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Acessos Ativos</CardTitle>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-emerald-600">{kpis.ativos}</div></CardContent>
        </Card>
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Bloqueados / Inativos</CardTitle>
            <UserX className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-rose-600">{kpis.inativos}</div></CardContent>
        </Card>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input 
            placeholder="Buscar por nome ou e-mail..." 
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

      {/* TABELA COM EFEITO ZEBRADO */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Colaborador</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Nível de Acesso</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center whitespace-nowrap">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right whitespace-nowrap">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {usuariosPaginados.map((u) => (
                // Efeito Zebrado com even:bg-slate-50/50 e hover
                <TableRow key={u.id} className="hover:bg-slate-100/60 even:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{u.nome}</span>
                      <span className="text-xs text-slate-500">{u.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-medium ${
                      u.role === 'Administrador' ? 'border-purple-200 text-purple-700 bg-purple-50' : 
                      u.role === 'Gestor' ? 'border-blue-200 text-blue-700 bg-blue-50' : 
                      'border-slate-200 text-slate-700 bg-white'
                    }`}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={u.status === 'Ativo' ? 'default' : 'secondary'} className={u.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}>
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium h-8">
                      Gerenciar
                    </Button>
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
              Mostrando <strong className="text-slate-900">{(paginaAtual - 1) * itensPorPagina + 1}</strong> até <strong className="text-slate-900">{Math.min(paginaAtual * itensPorPagina, usuariosFiltrados.length)}</strong> de <strong className="text-slate-900">{usuariosFiltrados.length}</strong>
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