'use client'

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';

export function SectorsClient({ initialSectors }: { initialSectors: any[] }) {
  const [sectors] = useState(initialSectors);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Setores & Custos</h2>
          <p className="text-slate-500 text-sm">Gerencie departamentos e tetos orçamentários.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Novo Setor
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute ml-3" />
        <Input placeholder="Buscar setor..." className="pl-9 bg-white" />
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome do Setor</TableHead>
              <TableHead>Gestor</TableHead>
              <TableHead className="text-right">Orçamento Mensal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectors.map((sector) => (
              <TableRow key={sector.id}>
                <TableCell className="font-mono text-slate-500">{sector.code}</TableCell>
                <TableCell className="font-medium text-slate-900">{sector.name}</TableCell>
                <TableCell>{sector.manager}</TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sector.budget)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}