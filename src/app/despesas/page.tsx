'use client'

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function DespesasPage() {
  const [expenses] = useState([
    { id: '1', date: '2026-09-28', os: 'OS-1042', plate: 'ABC-1234', value: 1250.00, status: 'Aprovado' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gastos & Despesas</h2>
        </div>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Lançar Despesa
        </Button>
      </div>
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>OS / NFe</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map(e => (
              <TableRow key={e.id}>
                <TableCell className="font-mono font-medium">{e.os}</TableCell>
                <TableCell className="font-mono">{e.plate}</TableCell>
                <TableCell className="font-mono">R$ {e.value.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-emerald-500 text-white">{e.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}