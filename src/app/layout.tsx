import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar"; // Ajuste o caminho se necessário

// Fonte recomendada para SaaS
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FrotaPRO | Gestão de Frotas",
  description: "MicroSaaS para gestão inteligente de frota e custos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        {/* Container principal (Impede rolagem da tela inteira, rola apenas o main) */}
        <div className="flex h-screen w-full overflow-hidden">
          
          {/* Menu Lateral (Desktop) */}
          <Sidebar />

          {/* Área Principal de Conteúdo */}
          <main className="flex-1 overflow-y-auto scroll-smooth">
            {/* O padding é aplicado aqui para manter a respiração das páginas */}
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
          
        </div>
      </body>
    </html>
  );
}