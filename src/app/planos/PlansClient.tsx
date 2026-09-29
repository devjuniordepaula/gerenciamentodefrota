'use client'

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';

export function PlansClient({ initialPlans }: { initialPlans: any[] }) {
  const [plans] = useState(initialPlans);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Planos de Manutenção</h2>
          <p className="text-slate-500 text-sm">Crie regras e alertas para manutenções programadas.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Criar Plano
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute ml-3" />
        <Input placeholder="Buscar plano..." className="pl-9 bg-white" />
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título do Plano</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Frequência (Gatilho)</TableHead>
              <TableHead className="text-right">Custo Estimado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium text-slate-900">{plan.title}</TableCell>
                <TableCell><Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">{plan.type}</Badge></TableCell>
                <TableCell className="font-mono text-slate-600">{plan.frequency}</TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.cost)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}