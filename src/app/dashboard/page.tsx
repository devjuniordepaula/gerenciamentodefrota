import { DashboardClient } from "./DashboardCliente";

export default async function DashboardPage() {
  // VIBE CODING: Aqui no futuro faremos fetch paralelo no Supabase
  // const [vehicles, expenses] = await Promise.all([
  //   supabase.from('vehicles').select('*'),
  //   supabase.from('expenses').select('*')
  // ]);

  // Dados mockados para você ver a interface funcionando HOJE
  const metrics = {
    totalVehicles: 42,
    activeVehicles: 38,
    monthlyBudget: 150000,
    spentThisMonth: 85400,
    pendingExpenses: 12,
  };

  return <DashboardClient metrics={metrics} />;
}