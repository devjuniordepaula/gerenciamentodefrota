'use client'

import React, { useState, useRef } from 'react';
import { 
  Camera, Mail, Lock, ShieldCheck, 
  User, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ConfiguracoesPage() {
  // --- ESTADOS DO PERFIL ---
  const [perfil, setPerfil] = useState({
    nome: 'Júnior de Paula',
    email: 'junior@frotapro.com',
    foto: 'https://github.com/shadcn.png'
  });
  
  const [isSavingPerfil, setIsSavingPerfil] = useState(false);
  const [sucessoPerfil, setSucessoPerfil] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ESTADOS DE SEGURANÇA (SENHA) ---
  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  
  const [isSavingSenha, setIsSavingSenha] = useState(false);
  const [sucessoSenha, setSucessoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState('');

  // --- HANDLERS DO PERFIL ---
  const handlePerfilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerfil(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSucessoPerfil(false); // Reseta a mensagem de sucesso se o usuário voltar a digitar
  };

  const handleFotoClick = () => {
    // Simula o clique no input de arquivo invisível
    fileInputRef.current?.click();
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cria uma URL local para preview imediato da imagem (UX rápida, Vibe Coding)
      const fotoUrl = URL.createObjectURL(file);
      setPerfil(prev => ({ ...prev, foto: fotoUrl }));
    }
  };

  const salvarPerfil = () => {
    setIsSavingPerfil(true);
    // Mock de chamada à API (Supabase: supabase.auth.updateUser)
    setTimeout(() => {
      setIsSavingPerfil(false);
      setSucessoPerfil(true);
      setTimeout(() => setSucessoPerfil(false), 3000); // Esconde sucesso após 3s
    }, 1000);
  };

  // --- HANDLERS DA SENHA ---
  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenhaData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErroSenha('');
    setSucessoSenha(false);
  };

  const salvarSenha = () => {
    // Validação preventiva (H5 Nielsen)
    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      setErroSenha('A nova senha e a confirmação não coincidem.');
      return;
    }
    if (senhaData.novaSenha.length < 6) {
      setErroSenha('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsSavingSenha(true);
    // Mock de chamada à API (Supabase: supabase.auth.updateUser({ password }))
    setTimeout(() => {
      setIsSavingSenha(false);
      setSucessoSenha(true);
      setSenhaData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      setTimeout(() => setSucessoSenha(false), 3000);
    }, 1200);
  };

  // Trava de segurança UX para o botão de senha
  const isSenhaValida = senhaData.senhaAtual.length > 0 && senhaData.novaSenha.length > 0 && senhaData.confirmarSenha.length > 0;

  return (
    <div className="animate-in fade-in duration-300 pb-10">
      
      {/* CABEÇALHO */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Configurações da Conta</h2>
        <p className="text-sm text-slate-500">Gerencie suas informações pessoais e preferências de segurança.</p>
      </div>

      {/* CONTAINER CENTRALIZADO (Previne telas ultrawide de esticarem o form) */}
      <div className="max-w-3xl space-y-6">
        
        {/* === CARD 1: DADOS DO PERFIL === */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Perfil Público
            </CardTitle>
            <CardDescription>
              Essas informações serão exibidas para outros usuários do seu time.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Seção da Foto (Avatar com funcionalidade de clique) */}
            <div className="flex items-center gap-5">
              <div 
                className="relative group cursor-pointer"
                onClick={handleFotoClick}
                title="Alterar foto de perfil"
              >
                <Avatar className="w-20 h-20 border-2 border-slate-100 shadow-sm transition-opacity group-hover:opacity-75">
                  <AvatarImage src={perfil.foto} alt={perfil.nome} className="object-cover" />
                  <AvatarFallback className="bg-slate-800 text-white text-xl">
                    {perfil.nome.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Ícone de Câmera flutuante no Hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                
                {/* Input file escondido */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFotoUpload} 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900">Sua Foto</span>
                <span className="text-xs text-slate-500 mb-2">JPG, PNG ou WebP. Máx 2MB.</span>
                <Button variant="outline" size="sm" onClick={handleFotoClick} className="w-fit h-8 text-xs">
                  Alterar Imagem
                </Button>
              </div>
            </div>

            {/* Inputs de Nome e E-mail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                <Input 
                  name="nome" 
                  value={perfil.nome} 
                  onChange={handlePerfilChange} 
                  placeholder="Seu nome" 
                  className="bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input 
                    name="email" 
                    type="email"
                    value={perfil.email} 
                    onChange={handlePerfilChange} 
                    placeholder="voce@empresa.com" 
                    className="bg-slate-50 pl-9"
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-between rounded-b-xl py-4">
            <div className="text-sm">
              {sucessoPerfil && (
                <span className="flex items-center text-emerald-600 animate-in fade-in slide-in-from-left-2">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Perfil atualizado com sucesso!
                </span>
              )}
            </div>
            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto transition-all" 
              onClick={salvarPerfil}
              disabled={isSavingPerfil}
            >
              {isSavingPerfil ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* === CARD 2: SEGURANÇA E SENHA === */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-500" /> Segurança
            </CardTitle>
            <CardDescription>
              Atualize sua senha para manter sua conta segura.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Senha Atual</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input 
                    name="senhaAtual" 
                    type="password"
                    value={senhaData.senhaAtual} 
                    onChange={handleSenhaChange} 
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-slate-700">Nova Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input 
                    name="novaSenha" 
                    type="password"
                    value={senhaData.novaSenha} 
                    onChange={handleSenhaChange} 
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Confirmar Nova Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input 
                    name="confirmarSenha" 
                    type="password"
                    value={senhaData.confirmarSenha} 
                    onChange={handleSenhaChange} 
                    className={`pl-9 ${erroSenha ? 'border-rose-300 focus-visible:ring-rose-500' : ''}`}
                  />
                </div>
                {erroSenha && (
                  <p className="text-xs text-rose-500 flex items-center mt-1 animate-in fade-in">
                    <AlertCircle className="w-3 h-3 mr-1" /> {erroSenha}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-between rounded-b-xl py-4">
            <div className="text-sm">
              {sucessoSenha && (
                <span className="flex items-center text-emerald-600 animate-in fade-in slide-in-from-left-2">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Senha atualizada com segurança!
                </span>
              )}
            </div>
            <Button 
              className="bg-slate-900 text-white hover:bg-slate-800 w-full sm:w-auto" 
              onClick={salvarSenha}
              disabled={isSavingSenha || !isSenhaValida}
            >
              {isSavingSenha ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Atualizando...</>
              ) : (
                'Atualizar Senha'
              )}
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}