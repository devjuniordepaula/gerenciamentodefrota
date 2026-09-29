'use client'

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PlanosPage() {
  const [plans] = useState([
    { id: '1', title: 'Revisão Óleo e Filtros', frequency: '10.000 km', cost: 1200 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Planos de Manutenção</h2>
        </div>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Criar Plano
        </Button>
      </div>
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plano</TableHead>
              <TableHead>Gatilho</TableHead>
              <TableHead className="text-right">Custo Médio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-slate-900">{p.title}</TableCell>
                <TableCell className="font-mono text-slate-600">{p.frequency}</TableCell>
                <TableCell className="text-right font-mono">R$ {p.cost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}