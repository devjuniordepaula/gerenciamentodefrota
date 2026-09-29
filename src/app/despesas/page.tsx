import { ExpensesClient } from "./GastosCliente";

export default async function ExpensesPage() {
  const expenses = [
    { id: '1', date: '2026-09-28', os: 'OS-1042', plate: 'ABC-1234', category: 'Peça', value: 1250.00, status: 'Aprovado' },
    { id: '2', date: '2026-09-27', os: 'OS-1041', plate: 'XYZ-9876', category: 'Serviço', value: 450.00, status: 'Pendente' },
  ];
  return <ExpensesClient initialExpenses={expenses} />;
}