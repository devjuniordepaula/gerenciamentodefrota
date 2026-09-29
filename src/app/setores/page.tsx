'use client'

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function SetoresPage() {
  const [sectors] = useState([
    { id: '1', name: 'Logística SP', code: 'LOG-01', manager: 'Carlos Silva', budget: 50000 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Setores & Custos</h2>
        </div>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Novo Setor
        </Button>
      </div>
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Setor</TableHead>
              <TableHead>Código</TableHead>
              <TableHead className="text-right">Orçamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectors.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-slate-900">{s.name}</TableCell>
                <TableCell className="font-mono">{s.code}</TableCell>
                <TableCell className="text-right font-mono">R$ {s.budget.toLocaleString('pt-BR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}