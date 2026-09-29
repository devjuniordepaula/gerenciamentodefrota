'use client'

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';

export function ExpensesClient({ initialExpenses }: { initialExpenses: any[] }) {
  const [expenses] = useState(initialExpenses);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gastos & Despesas</h2>
          <p className="text-slate-500 text-sm">Controle de notas fiscais e ordens de serviço (OS).</p>
        </div>
        {/* VIBE CODING: Botão de lançar despesa na mesma tela para UX rápida */}
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Lançar Despesa
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute ml-3" />
        <Input placeholder="Buscar OS ou Placa..." className="pl-9 bg-white" />
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>OS / NFe</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell className="text-slate-500">{exp.date}</TableCell>
                <TableCell className="font-mono font-medium">{exp.os}</TableCell>
                <TableCell><Badge variant="outline">{exp.plate}</Badge></TableCell>
                <TableCell>{exp.category}</TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(exp.value)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={exp.status === 'Aprovado' ? 'default' : 'secondary'} 
                         className={exp.status === 'Aprovado' ? 'bg-emerald-500' : 'bg-amber-500'}>
                    {exp.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}