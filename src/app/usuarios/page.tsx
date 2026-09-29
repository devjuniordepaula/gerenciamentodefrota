'use client'

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function UsuariosPage() {
  const [usuarios] = useState([
    { id: '1', name: 'Carlos Eduardo', email: 'carlos@empresa.com', role: 'Administrador', status: 'Ativo' },
    { id: '2', name: 'Mariana Silva', email: 'mariana@empresa.com', role: 'Gestor', status: 'Ativo' },
    { id: '3', name: 'João Souza', email: 'joao@empresa.com', role: 'Operador', status: 'Inativo' },
  ]);
  
  const [busca, setBusca] = useState('');

  const usuariosFiltrados = usuarios.filter(u => 
    u.name.toLowerCase().includes(busca.toLowerCase()) || 
    u.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Usuários & Permissões</h2>
          <p className="text-sm text-slate-500">Gerencie os acessos, cargos e perfis da sua equipe no sistema.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Convidar Usuário
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input 
            placeholder="Buscar por nome ou e-mail..." 
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-600" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)} 
          />
        </div>
        
        <div className="text-xs font-mono text-slate-500 hidden sm:block">
          Total: <strong className="text-slate-900">{usuariosFiltrados.length}</strong> usuário(s)
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Nome</TableHead>
              <TableHead className="font-semibold text-slate-700">E-mail</TableHead>
              <TableHead className="font-semibold text-slate-700">Nível de Acesso</TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {usuariosFiltrados.map((u) => (
              <TableRow key={u.id} className="hover:bg-slate-50/60 transition-colors">
                <TableCell className="font-medium text-slate-900">{u.name}</TableCell>
                <TableCell className="text-slate-500">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    u.role === 'Administrador' ? 'border-purple-200 text-purple-700 bg-purple-50 font-normal' : 
                    u.role === 'Gestor' ? 'border-blue-200 text-blue-700 bg-blue-50 font-normal' : 
                    'border-slate-200 text-slate-700 bg-slate-50 font-normal'
                  }>
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={u.status === 'Ativo' ? 'default' : 'secondary'} 
                         className={u.status === 'Ativo' ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-normal' : 'bg-slate-300 text-slate-600 font-normal'}>
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium">
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {usuariosFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}