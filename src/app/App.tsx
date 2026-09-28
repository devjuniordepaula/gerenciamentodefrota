import React from 'react';
import { FleetProvider, useFleet } from './context/FleetContext';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardView } from '../components/views/DashboardView';
import { SectorsView } from '../components/views/SectorsView';
import { UsersView } from '../components/views/UsersView';
import { VehiclesView } from '../components/views/VehiclesView';
import { MaintenancePlansView } from '../components/views/MaintenancePlansView';
import { WarrantiesView } from '../components/views/WarrantiesView';
import { ExpensesView } from '../components/views/ExpensesView';
import { PriceComparisonView } from '../components/views/PriceComparisonView';
import { FinancialCalendarView } from '../components/views/FinancialCalendarView';
import { AccreditedView } from '../components/views/AccreditedView';
import { MonthlyReportsView } from '../components/views/MonthlyReportsView'


const MainContent: React.FC = () => {
  const { activeTab } = useFleet();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'sectors':
        return <SectorsView />;
      case 'users':
        return <UsersView />;
      case 'vehicles':
        return <VehiclesView />;
      case 'plans':
        return <MaintenancePlansView />;
      case 'warranties':
        return <WarrantiesView />;
      case 'expenses':
        return <ExpensesView />;
      case 'price_comparison':
        return <PriceComparisonView />;
      case 'financial_calendar':
        return <FinancialCalendarView />;
      case 'accredited':
        return <AccreditedView />;
      case 'reports':
        return <MonthlyReportsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar navigation */}
      <div className="no-print">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <FleetProvider>
      <MainContent />
    </FleetProvider>
  );
}
