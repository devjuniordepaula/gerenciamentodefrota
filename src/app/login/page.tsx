'use client'

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Substituir pela chamada real do Supabase Auth (ex: supabase.auth.signInWithPassword)
    // Simulação de login bem-sucedido para testar o fluxo da UI:
    router.push("/painel");
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">


         {/* LADO DIREITO: Imagem de Destaque (Escondido no Mobile) */}
      <div className="hidden lg:block relative bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/40 z-10 mix-blend-multiply" />
        
        {/*<Image
          src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop"
          alt="Gestão de Frotas"
          fill
          className="object-cover"
          priority
        />*/}
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-12 text-center text-white">
          <div className="animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white drop-shadow-md">
              Gestão de Frota <br />
              <span className="text-blue-400">Simplificada</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-md mx-auto drop-shadow">
              Otimize custos, controle manutenções e acompanhe seus veículos em tempo real com o FrotaMaster.
            </p>
          </div>
        </div>
      </div>
      
      {/* LADO ESQUERDO: Formulário de Login */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Truck className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Acesse sua conta
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Insira suas credenciais corporativas para entrar no painel.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              
              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  E-mail corporativo
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nome@empresa.com.br" 
                  required 
                  className="bg-white border-slate-200 focus-visible:ring-blue-600" 
                />
              </div>

              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Senha
                  </Label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-white border-slate-200 focus-visible:ring-blue-600" 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors h-11"
            >
              Entrar no Sistema
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 mt-8">
            Problemas para acessar? <a href="#" className="text-blue-600 hover:underline">Fale com o suporte</a>
          </div>
        </div>
      </div>

     

    </div>
  );
}