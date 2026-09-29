import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FrotaMaster | SaaS",
  description: "Gestão de Frotas Simplificada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Toda a mágica acontece aqui */}
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}