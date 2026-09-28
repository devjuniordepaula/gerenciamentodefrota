import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Sector,
  User,
  Vehicle,
  MaintenancePlan,
  Warranty,
  Expense,
  PartComparison,
  AccreditedProvider,
} from '../../app/types/fleet';
import {
  INITIAL_SECTORS,
  INITIAL_USERS,
  INITIAL_VEHICLES,
  INITIAL_MAINTENANCE_PLANS,
  INITIAL_WARRANTIES,
  INITIAL_EXPENSES,
  INITIAL_PART_COMPARISONS,
  INITIAL_ACCREDITED_PROVIDERS,
} from '../data/mockData';

interface FinancialMetrics {
  totalMonthlyBudget: number;
  totalAnnualBudget: number;
  totalSpentCurrentMonth: number;
  totalSpentYear: number;
  remainingMonthlyBudget: number;
  remainingAnnualBudget: number;
  monthlyConsumptionPercentage: number;
  annualConsumptionPercentage: number;
}

interface FleetContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Active User session & permissions
  currentUser: User;
  setCurrentUserId: (userId: string) => void;

  // Data collections
  sectors: Sector[];
  users: User[];
  vehicles: Vehicle[];
  maintenancePlans: MaintenancePlan[];
  warranties: Warranty[];
  expenses: Expense[];
  partComparisons: PartComparison[];
  accreditedProviders: AccreditedProvider[];

  // Metrics
  metrics: FinancialMetrics;

  // CRUD Sectors
  addSector: (sector: Omit<Sector, 'id' | 'createdAt'>) => void;
  updateSector: (id: string, sector: Partial<Sector>) => void;
  deleteSector: (id: string) => void;

  // CRUD Users
  addUser: (user: Omit<User, 'id' | 'lastLogin'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // CRUD Vehicles
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  // CRUD Maintenance Plans
  addMaintenancePlan: (plan: Omit<MaintenancePlan, 'id'>) => void;
  updateMaintenancePlan: (id: string, plan: Partial<MaintenancePlan>) => void;
  deleteMaintenancePlan: (id: string) => void;

  // CRUD Warranties
  addWarranty: (warranty: Omit<Warranty, 'id'>) => void;
  updateWarranty: (id: string, warranty: Partial<Warranty>) => void;
  deleteWarranty: (id: string) => void;
  claimWarranty: (id: string, notes: string) => void;

  // CRUD Expenses
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  approveExpense: (id: string, approverName: string) => void;

  // CRUD Part Comparisons
  addPartComparison: (part: Omit<PartComparison, 'id' | 'lastUpdated'>) => void;
  updatePartComparison: (id: string, part: Partial<PartComparison>) => void;
  deletePartComparison: (id: string) => void;
  addQuoteToPart: (partId: string, quote: PartComparison['quotes'][0]) => void;

  // CRUD Accredited Providers
  addProvider: (provider: Omit<AccreditedProvider, 'id'>) => void;
  updateProvider: (id: string, provider: Partial<AccreditedProvider>) => void;
  deleteProvider: (id: string) => void;

  // Storage Utilities
  resetToDefaults: () => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SECTORS: 'frotamaster_sectors_v1',
  USERS: 'frotamaster_users_v1',
  CURRENT_USER_ID: 'frotamaster_curr_user_v1',
  VEHICLES: 'frotamaster_vehicles_v1',
  PLANS: 'frotamaster_plans_v1',
  WARRANTIES: 'frotamaster_warranties_v1',
  EXPENSES: 'frotamaster_expenses_v1',
  PARTS: 'frotamaster_parts_v1',
  PROVIDERS: 'frotamaster_providers_v1',
};

export const FleetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Load state from localStorage or fall back to mock
  const [sectors, setSectors] = useState<Sector[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SECTORS);
    return saved ? JSON.parse(saved) : INITIAL_SECTORS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'usr-1';
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [maintenancePlans, setMaintenancePlans] = useState<MaintenancePlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_PLANS;
  });

  const [warranties, setWarranties] = useState<Warranty[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WARRANTIES);
    return saved ? JSON.parse(saved) : INITIAL_WARRANTIES;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [partComparisons, setPartComparisons] = useState<PartComparison[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARTS);
    return saved ? JSON.parse(saved) : INITIAL_PART_COMPARISONS;
  });

  const [accreditedProviders, setAccreditedProviders] = useState<AccreditedProvider[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
    return saved ? JSON.parse(saved) : INITIAL_ACCREDITED_PROVIDERS;
  });

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECTORS, JSON.stringify(sectors));
  }, [sectors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(maintenancePlans));
  }, [maintenancePlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WARRANTIES, JSON.stringify(warranties));
  }, [warranties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(partComparisons));
  }, [partComparisons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(accreditedProviders));
  }, [accreditedProviders]);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const setCurrentUserId = (id: string) => {
    setCurrentUserIdState(id);
  };

  // Calculate high-level financial metrics (Budget vs Spent vs Remaining)
  const metrics = useMemo<FinancialMetrics>(() => {
    const totalMonthlyBudget = sectors.reduce((acc, s) => acc + s.monthlyBudget, 0);
    const totalAnnualBudget = sectors.reduce((acc, s) => acc + s.annualBudget, 0);

    // Current month filter (September 2026 based on mock context or standard month)
    const currentYear = '2026';
    const currentMonthPrefix = '2026-09';

    const totalSpentCurrentMonth = expenses
      .filter((e) => e.date.startsWith(currentMonthPrefix) && e.status !== 'glosado')
      .reduce((acc, e) => acc + e.totalCost, 0);

    const totalSpentYear = expenses
      .filter((e) => e.date.startsWith(currentYear) && e.status !== 'glosado')
      .reduce((acc, e) => acc + e.totalCost, 0);

    const remainingMonthlyBudget = totalMonthlyBudget - totalSpentCurrentMonth;
    const remainingAnnualBudget = totalAnnualBudget - totalSpentYear;

    const monthlyConsumptionPercentage = totalMonthlyBudget > 0
      ? (totalSpentCurrentMonth / totalMonthlyBudget) * 100
      : 0;

    const annualConsumptionPercentage = totalAnnualBudget > 0
      ? (totalSpentYear / totalAnnualBudget) * 100
      : 0;

    return {
      totalMonthlyBudget,
      totalAnnualBudget,
      totalSpentCurrentMonth,
      totalSpentYear,
      remainingMonthlyBudget,
      remainingAnnualBudget,
      monthlyConsumptionPercentage,
      annualConsumptionPercentage,
    };
  }, [sectors, expenses]);

  // Sector Handlers
  const addSector = (newSec: Omit<Sector, 'id' | 'createdAt'>) => {
    const id = `sec-${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];
    setSectors((prev) => [...prev, { ...newSec, id, createdAt }]);
  };

  const updateSector = (id: string, updated: Partial<Sector>) => {
    setSectors((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSector = (id: string) => {
    setSectors((prev) => prev.filter((s) => s.id !== id));
  };

  // User Handlers
  const addUser = (newUser: Omit<User, 'id' | 'lastLogin'>) => {
    const id = `usr-${Date.now()}`;
    const lastLogin = 'Nunca acessou';
    setUsers((prev) => [...prev, { ...newUser, id, lastLogin }]);
  };

  const updateUser = (id: string, updated: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Vehicle Handlers
  const addVehicle = (newVeh: Omit<Vehicle, 'id'>) => {
    const id = `veh-${Date.now()}`;
    setVehicles((prev) => [
      {
        ...newVeh,
        id,
        plate: newVeh.plate.toUpperCase(),
      },
      ...prev,
    ]);
  };

  const updateVehicle = (id: string, updated: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              ...updated,
              plate: updated.plate ? updated.plate.toUpperCase() : v.plate,
            }
          : v
      )
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  // Plan Handlers
  const addMaintenancePlan = (newPlan: Omit<MaintenancePlan, 'id'>) => {
    const id = `plan-${Date.now()}`;
    setMaintenancePlans((prev) => [...prev, { ...newPlan, id }]);
  };

  const updateMaintenancePlan = (id: string, updated: Partial<MaintenancePlan>) => {
    setMaintenancePlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteMaintenancePlan = (id: string) => {
    setMaintenancePlans((prev) => prev.filter((p) => p.id !== id));
  };

  // Warranty Handlers
  const addWarranty = (newWar: Omit<Warranty, 'id'>) => {
    const id = `war-${Date.now()}`;
    setWarranties((prev) => [{ ...newWar, id }, ...prev]);
  };

  const updateWarranty = (id: string, updated: Partial<Warranty>) => {
    setWarranties((prev) => prev.map((w) => (w.id === id ? { ...w, ...updated } : w)));
  };

  const deleteWarranty = (id: string) => {
    setWarranties((prev) => prev.filter((w) => w.id !== id));
  };

  const claimWarranty = (id: string, notes: string) => {
    const today = new Date().toISOString().split('T')[0];
    setWarranties((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status: 'acionada',
              claimNotes: notes,
              claimedAt: today,
            }
          : w
      )
    );
  };

  // Expense Handlers
  const addExpense = (newExp: Omit<Expense, 'id'>) => {
    const id = `exp-${Date.now()}`;
    setExpenses((prev) => [{ ...newExp, id }, ...prev]);
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const approveExpense = (id: string, approverName: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: 'aprovado',
              approvedBy: approverName,
            }
          : e
      )
    );
  };

  // Part Comparison Handlers
  const addPartComparison = (newPart: Omit<PartComparison, 'id' | 'lastUpdated'>) => {
    const id = `pc-${Date.now()}`;
    const lastUpdated = new Date().toISOString().split('T')[0];
    setPartComparisons((prev) => [...prev, { ...newPart, id, lastUpdated }]);
  };

  const updatePartComparison = (id: string, updated: Partial<PartComparison>) => {
    const lastUpdated = new Date().toISOString().split('T')[0];
    setPartComparisons((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated, lastUpdated } : p))
    );
  };

  const deletePartComparison = (id: string) => {
    setPartComparisons((prev) => prev.filter((p) => p.id !== id));
  };

  const addQuoteToPart = (partId: string, quote: PartComparison['quotes'][0]) => {
    const lastUpdated = new Date().toISOString().split('T')[0];
    setPartComparisons((prev) =>
      prev.map((p) =>
        p.id === partId
          ? {
              ...p,
              quotes: [...p.quotes, quote],
              lastUpdated,
            }
          : p
      )
    );
  };

  // Provider Handlers
  const addProvider = (newProv: Omit<AccreditedProvider, 'id'>) => {
    const id = `prov-${Date.now()}`;
    setAccreditedProviders((prev) => [...prev, { ...newProv, id }]);
  };

  const updateProvider = (id: string, updated: Partial<AccreditedProvider>) => {
    setAccreditedProviders((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProvider = (id: string) => {
    setAccreditedProviders((prev) => prev.filter((p) => p.id !== id));
  };

  const resetToDefaults = () => {
    if (window.confirm('Deseja restaurar todos os dados para o estado inicial demonstrativo?')) {
      setSectors(INITIAL_SECTORS);
      setUsers(INITIAL_USERS);
      setCurrentUserIdState('usr-1');
      setVehicles(INITIAL_VEHICLES);
      setMaintenancePlans(INITIAL_MAINTENANCE_PLANS);
      setWarranties(INITIAL_WARRANTIES);
      setExpenses(INITIAL_EXPENSES);
      setPartComparisons(INITIAL_PART_COMPARISONS);
      setAccreditedProviders(INITIAL_ACCREDITED_PROVIDERS);
      localStorage.clear();
    }
  };

  return (
    <FleetContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUserId,
        sectors,
        users,
        vehicles,
        maintenancePlans,
        warranties,
        expenses,
        partComparisons,
        accreditedProviders,
        metrics,
        addSector,
        updateSector,
        deleteSector,
        addUser,
        updateUser,
        deleteUser,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addMaintenancePlan,
        updateMaintenancePlan,
        deleteMaintenancePlan,
        addWarranty,
        updateWarranty,
        deleteWarranty,
        claimWarranty,
        addExpense,
        updateExpense,
        deleteExpense,
        approveExpense,
        addPartComparison,
        updatePartComparison,
        deletePartComparison,
        addQuoteToPart,
        addProvider,
        updateProvider,
        deleteProvider,
        resetToDefaults,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
};
