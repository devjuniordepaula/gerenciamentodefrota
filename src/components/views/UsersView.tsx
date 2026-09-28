import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { User, UserRole, UserPermissions } from '../types/fleet';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Shield,
  ShieldCheck,
  Check,
  X,
  UserCheck,
  Building2,
} from 'lucide-react';

const DEFAULT_PERMISSIONS_BY_ROLE: Record<UserRole, UserPermissions> = {
  admin: {
    canManageVehicles: true,
    canManagePlans: true,
    canManageExpenses: true,
    canManageWarranties: true,
    canManageAccredited: true,
    canViewFinancials: true,
    canManageUsers: true,
    canManageSectors: true,
    canExportReports: true,
    canApproveExpenses: true,
  },
  fleet_manager: {
    canManageVehicles: true,
    canManagePlans: true,
    canManageExpenses: true,
    canManageWarranties: true,
    canManageAccredited: true,
    canViewFinancials: true,
    canManageUsers: false,
    canManageSectors: false,
    canExportReports: true,
    canApproveExpenses: true,
  },
  maintenance_supervisor: {
    canManageVehicles: true,
    canManagePlans: true,
    canManageExpenses: true,
    canManageWarranties: true,
    canManageAccredited: true,
    canViewFinancials: false,
    canManageUsers: false,
    canManageSectors: false,
    canExportReports: true,
    canApproveExpenses: false,
  },
  financial_auditor: {
    canManageVehicles: false,
    canManagePlans: false,
    canManageExpenses: true,
    canManageWarranties: true,
    canManageAccredited: false,
    canViewFinancials: true,
    canManageUsers: false,
    canManageSectors: false,
    canExportReports: true,
    canApproveExpenses: true,
  },
  driver_operator: {
    canManageVehicles: false,
    canManagePlans: false,
    canManageExpenses: false,
    canManageWarranties: false,
    canManageAccredited: false,
    canViewFinancials: false,
    canManageUsers: false,
    canManageSectors: false,
    canExportReports: false,
    canApproveExpenses: false,
  },
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador Geral',
  fleet_manager: 'Gestor de Frota',
  maintenance_supervisor: 'Supervisor de Manutenção',
  financial_auditor: 'Auditor Financeiro / Controladoria',
  driver_operator: 'Motorista / Operador de Frota',
};

export const UsersView: React.FC = () => {
  const { users, sectors, currentUser, setCurrentUserId, addUser, updateUser, deleteUser } = useFleet();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('fleet_manager');
  const [roleTitle, setRoleTitle] = useState('');
  const [sectorId, setSectorId] = useState(sectors[0]?.id || '');
  const [active, setActive] = useState(true);
  const [permissions, setPermissions] = useState<UserPermissions>(DEFAULT_PERMISSIONS_BY_ROLE.fleet_manager);

  const canManage = currentUser.permissions.canManageUsers || currentUser.role === 'admin';

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setRoleTitle(ROLE_LABELS[newRole]);
    setPermissions(DEFAULT_PERMISSIONS_BY_ROLE[newRole]);
  };

  const handleTogglePermission = (key: keyof UserPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('fleet_manager');
    setRoleTitle('Gestor de Frota');
    setSectorId(sectors[0]?.id || '');
    setActive(true);
    setPermissions(DEFAULT_PERMISSIONS_BY_ROLE.fleet_manager);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setRoleTitle(user.roleTitle);
    setSectorId(user.sectorId);
    setActive(user.active);
    setPermissions(user.permissions);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name,
        email,
        role,
        roleTitle: roleTitle || ROLE_LABELS[role],
        sectorId,
        active,
        permissions,
      });
    } else {
      addUser({
        name,
        email,
        role,
        roleTitle: roleTitle || ROLE_LABELS[role],
        sectorId,
        avatar: '',
        active,
        permissions,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, uName: string) => {
    if (users.length <= 1) {
      alert('Não é possível remover o único usuário do sistema.');
      return;
    }
    if (id === currentUser.id) {
      alert('Você não pode excluir o usuário que está atualmente logado.');
      return;
    }
    if (confirm(`Deseja realmente remover o usuário "${uName}"?`)) {
      deleteUser(id);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const sectorName = sectors.find((s) => s.id === u.sectorId)?.name || '';
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.roleTitle.toLowerCase().includes(q) ||
      sectorName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Usuários & Matriz Granular de Permissões
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure controle de acesso baseado em função (RBAC) e habilite/desabilite permissões por funcionalidade.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Usuário</span>
          </button>
        )}
      </div>

      {/* Info notice about live testing */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Simulação de Acesso:</strong> Você pode alternar o usuário ativo clicando em &quot;Alternar Sessão&quot; em qualquer cartão abaixo para testar as restrições no menu lateral e botões.
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email, cargo ou setor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums">
          Usuários cadastrados: <span className="font-semibold text-slate-800">{filteredUsers.length}</span>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((user) => {
          const sector = sectors.find((s) => s.id === user.sectorId);
          const isCurrentUser = user.id === currentUser.id;

          const grantedCount = Object.values(user.permissions).filter(Boolean).length;
          const totalPermsCount = Object.keys(user.permissions).length;

          return (
            <div
              key={user.id}
              className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                isCurrentUser ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {user.name}
                        </h3>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-mono font-semibold">
                            Você
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        title="Editar Permissões"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Remover Usuário"
                        disabled={isCurrentUser}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Role and Sector Info */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Perfil:</span>
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {user.roleTitle}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Setor:</span>
                    <span className="text-slate-700 font-medium">
                      {sector ? sector.name : 'Geral / Não atribuído'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Acessos Ativos:</span>
                    <span className="font-mono text-slate-700">
                      {grantedCount} de {totalPermsCount} módulos
                    </span>
                  </div>
                </div>

                {/* Granular Permission Tags preview */}
                <div className="mt-3 flex flex-wrap gap-1 text-[10px]">
                  {user.permissions.canManageVehicles && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                      Veículos
                    </span>
                  )}
                  {user.permissions.canManageExpenses && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                      Gastos/OS
                    </span>
                  )}
                  {user.permissions.canViewFinancials && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                      Financeiro
                    </span>
                  )}
                  {user.permissions.canManagePlans && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                      Planos
                    </span>
                  )}
                  {user.permissions.canManageAccredited && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                      Credenciados
                    </span>
                  )}
                  {user.permissions.canExportReports && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                      Relatórios
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Switch button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setCurrentUserId(user.id)}
                  disabled={isCurrentUser}
                  className={`w-full py-1.5 px-3 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    isCurrentUser
                      ? 'bg-amber-100 text-amber-900 cursor-default'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isCurrentUser ? 'Sessão Ativa' : 'Alternar para este Usuário'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal User & Permissions Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-900">
                {editingUser ? 'Editar Usuário & Permissões' : 'Cadastrar Novo Usuário'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Roberto Alencar"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    E-mail Corporativo *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="roberto@frotamaster.com.br"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Perfil / Função Base
                  </label>
                  <select
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="admin">Administrador Geral</option>
                    <option value="fleet_manager">Gestor de Frota</option>
                    <option value="maintenance_supervisor">Supervisor de Manutenção</option>
                    <option value="financial_auditor">Auditor Financeiro</option>
                    <option value="driver_operator">Motorista / Operador</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Setor de Lotação
                  </label>
                  <select
                    value={sectorId}
                    onChange={(e) => setSectorId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Granular Permission Matrix */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Matriz de Permissões Granulares
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Ative ou restrinja o acesso a cada módulo individualmente.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-2 text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={permissions.canManageVehicles}
                      onChange={() => handleTogglePermission('canManageVehicles')}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                    />
                    <span>Gerenciar Frota de Veículos</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={permissions.canManagePlans}
                      onChange={() => handleTogglePermission('canManagePlans')}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                    />
                    <span>Planos de Manutenção</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={permissions.canManageExpenses}
                      onChange={() => handleTogglePermission('canManageExpenses')}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                    />
                    <span>Lançar Gastos e Ordens de Serviço</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={permissions.canApproveExpenses}
                      onChange={() => handleTogglePermission('canApproveExpenses')}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                    />
                    <span>Aprovar Pagamentos de Despesas</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={permissions.canManageWarranties}
                      onChange={() => handleTogglePermission('canManageWarranties')}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                    />
                    <span>Controle & Acionamento de Garantias</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={permissions.canManageAccredited}
                      onChange={() => handleTogglePermission('canManageAccredited')}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                    />
                    <span>Gerenciar Rede de Credenciados</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={permissions.canViewFinancials}
                      onChange={() => handleTogglePermission('canViewFinancials')}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                    />
                    <span>Painel Financeiro & Calendário Anual</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={permissions.canExportReports}
                      onChange={() => handleTogglePermission('canExportReports')}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                    />
                    <span>Exportar Relatórios Mensais / CSV</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={permissions.canManageSectors}
                      onChange={() => handleTogglePermission('canManageSectors')}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                    />
                    <span>Gerenciar Setores & Orçamentos</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={permissions.canManageUsers}
                      onChange={() => handleTogglePermission('canManageUsers')}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                    />
                    <span>Gerenciar Usuários & Acessos</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingUser ? 'Salvar Usuário' : 'Criar Usuário'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
