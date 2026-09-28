export type UserRole = 
  | 'admin'
  | 'fleet_manager'
  | 'maintenance_supervisor'
  | 'financial_auditor'
  | 'driver_operator';

export interface UserPermissions {
  canManageVehicles: boolean;
  canManagePlans: boolean;
  canManageExpenses: boolean;
  canManageWarranties: boolean;
  canManageAccredited: boolean;
  canViewFinancials: boolean;
  canManageUsers: boolean;
  canManageSectors: boolean;
  canExportReports: boolean;
  canApproveExpenses: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  sectorId: string;
  avatar: string;
  active: boolean;
  permissions: UserPermissions;
  lastLogin: string;
}

export interface Sector {
  id: string;
  name: string;
  code: string;
  costCenter: string;
  managerName: string;
  email: string;
  phone: string;
  monthlyBudget: number;
  annualBudget: number;
  createdAt: string;
}

export type VehicleCategory = 
  | 'Caminhão Pesado'
  | 'Caminhão Médio'
  | 'Van de Carga'
  | 'Utilitário'
  | 'Passeio';

export type VehicleStatus = 'active' | 'in_maintenance' | 'inactive' | 'standby';

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  category: VehicleCategory;
  chassis: string;
  renavam: string;
  sectorId: string;
  currentKm: number;
  fuelType: 'Diesel S10' | 'Diesel Comum' | 'Flex' | 'Gasolina' | 'Elétrico';
  status: VehicleStatus;
  driverName: string;
  acquisitionDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceKm: number;
  averageConsumptionKmPerL: number;
}

export type PlanType = 'preventiva' | 'corretiva' | 'preditiva' | 'revisao_obrigatoria';

export interface PlanItem {
  id: string;
  name: string;
  category: 'motor' | 'freios' | 'suspensao' | 'eletrica' | 'pneus' | 'fluidos' | 'geral';
  required: boolean;
}

export interface MaintenancePlan {
  id: string;
  title: string;
  type: PlanType;
  frequencyType: 'km' | 'days' | 'hybrid';
  intervalKm: number;
  intervalDays: number;
  targetCategory: string; // 'Todos' or specific category
  targetVehicleIds: string[];
  items: PlanItem[];
  estimatedCost: number;
  active: boolean;
  description: string;
}

export type WarrantyStatus = 'vigente' | 'vencendo' | 'expirada' | 'acionada';

export interface Warranty {
  id: string;
  partOrService: string;
  vehicleId: string;
  vehiclePlate: string;
  providerId: string;
  providerName: string;
  invoiceNumber: string;
  workOrderNumber: string;
  startDate: string;
  endDate: string;
  coverageKm?: number;
  startKm?: number;
  status: WarrantyStatus;
  valueCovered: number;
  claimNotes?: string;
  claimedAt?: string;
}

export type ExpenseType = 'peca' | 'servico' | 'oleo_fluidos' | 'pneus' | 'funilaria';
export type ExpenseStatus = 'pago' | 'aprovado' | 'pendente' | 'glosado';

export interface Expense {
  id: string;
  workOrderNumber: string;
  vehicleId: string;
  vehiclePlate: string;
  sectorId: string;
  providerId: string;
  providerName: string;
  type: ExpenseType;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  date: string;
  invoiceNumber: string;
  status: ExpenseStatus;
  approvedBy?: string;
  notes?: string;
}

export interface PartQuote {
  providerId: string;
  providerName: string;
  price: number;
  brand: string;
  warrantyMonths: number;
  availabilityDays: number;
  deliveryIncluded: boolean;
  rating: number;
}

export interface PartComparison {
  id: string;
  partCode: string;
  name: string;
  category: string;
  compatibleModels: string[];
  quotes: PartQuote[];
  lastUpdated: string;
}

export interface AccreditedProvider {
  id: string;
  name: string;
  tradeName: string;
  cnpj: string;
  phone: string;
  email: string;
  contactPerson: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  services: string[];
  rating: number; // 0 - 5
  nps: number; // -100 to 100
  totalServicesDone: number;
  hourlyRate: number;
  openingHours: string;
  status: 'ativo' | 'homologacao' | 'suspenso';
}
