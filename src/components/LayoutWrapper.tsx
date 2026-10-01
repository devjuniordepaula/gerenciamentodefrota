'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define quais rotas NÃO devem ter a sidebar (Rotas Públicas)
  // Adicione outras aqui se precisar no futuro (ex: '/recuperar-senha')
  const isPublicRoute = pathname === '/login' || pathname === '/';

  // Se for tela de login, renderiza apenas o conteúdo, sem menu e sem formatação de painel
  if (isPublicRoute) {
    return <main className="min-h-screen w-full bg-slate-50">{children}</main>;
  }

  // Se for qualquer outra tela (Painel, Veículos, etc), renderiza com a Sidebar
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}