import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { ThemeProvider } from "@/components/theme-provider"; // <-- IMPORT AQUI

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
      {/* Removemos o bg-slate-50 fixo daqui, pois o tema cuidará disso */}
      <body className={`${inter.className} antialiased min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50`}>
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}