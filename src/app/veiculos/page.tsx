'use client'

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';

export default function VeiculosPage() {
  const [vehicles] = useState([
    { id: '1', plate: 'ABC-1234', brand: 'Volvo', model: 'FH 540', year: 2023, status: 'Ativo' },
    { id: '2', plate: 'XYZ-9876', brand: 'Scania', model: 'R450', year: 2022, status: 'Manutenção' },
  ]);
  const [search, setSearch] = useState('');
  
  const filtered = vehicles.filter(v => v.plate.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Frota de Veículos</h2>
          <p className="text-sm text-slate-500">Gerenciamento de unidades.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Cadastrar Veículo
        </Button>
      </div>
      
      <div className="flex items-center gap-2 max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3" />
        <Input 
          placeholder="Buscar por placa..." 
          className="pl-9 bg-white" 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>
      
      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(v => (
              <TableRow key={v.id}>
                <TableCell className="font-mono font-medium">{v.plate}</TableCell>
                <TableCell>{v.brand} {v.model}</TableCell>
                <TableCell>
                  <Badge variant={v.status === 'Ativo' ? 'default' : 'destructive'}>
                    {v.status}
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