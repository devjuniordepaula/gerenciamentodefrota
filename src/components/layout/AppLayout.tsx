'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar'
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Se estiver no login ou na raiz, renderiza só a página pura (sem Sidebar)
  const isAuthPage = pathname === '/login' || pathname === '/';

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Se não for auth, renderiza a estrutura de SaaS com a Sidebargit 
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Espaço para o Header no futuro, se quiser */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}