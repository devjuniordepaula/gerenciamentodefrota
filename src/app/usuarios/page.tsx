import { UsersClient } from "./UsersClient"

export default async function UsersPage() {
  // Mock para visualizar a tela hoje. Depois substituiremos por supabase.from('profiles').select('*')
  const users = [
    { id: '1', name: 'Carlos Eduardo', email: 'carlos@empresa.com', role: 'Administrador', status: 'Ativo' },
    { id: '2', name: 'Mariana Silva', email: 'mariana@empresa.com', role: 'Gestor', status: 'Ativo' },
    { id: '3', name: 'João Souza', email: 'joao@empresa.com', role: 'Operador', status: 'Inativo' },
  ];
  
  return <UsersClient initialUsers={users} />;
}