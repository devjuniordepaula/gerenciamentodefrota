'use client'

import { useFleet } from '../context/FleetContext'
import { DashboardView } from '../../components/views/DashboardView'
import { SectorsView } from '../../components/views/SectorsView'
import { ExpensesView } from '../../components/views/ExpensesView'
// ... importe as outras views

export default function DashboardRouter() {
  const { activeTab } = useFleet()

  // Como seus componentes originais usavam abas (activeTab) em vez de URLs reais,
  // podemos manter essa lógica de SPA (Single Page Application) para o MVP rodar instantaneamente.
  // Depois, refatoramos para URLs reais do Next.js (/dashboard/sectors, etc).

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />
      case 'sectors': return <SectorsView />
      case 'expenses': return <ExpensesView />
      // Adicione os demais cases aqui
      default: return <DashboardView />
    }
  }

  return (
    <div className="animate-in fade-in duration-500">
      {renderView()}
    </div>
  )
}