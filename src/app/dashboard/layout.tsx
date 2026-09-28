'use client'

import React from 'react'
import { Sidebar } from '../../components/layout/Sidebar'
import { Header } from '../../components/layout/Header'
import { FleetProvider } from '../context/FleetContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // O FleetProvider abraça tudo para injetar os dados mockados temporários
    <FleetProvider>
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900 font-sans">
        {/* Barra Lateral Fixa */}
        <Sidebar />

        {/* Área Principal */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header Superior Fixo */}
          <Header />

          {/* Conteúdo Dinâmico (As Views) */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </FleetProvider>
  )
}