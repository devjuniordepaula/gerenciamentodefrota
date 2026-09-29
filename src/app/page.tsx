import { redirect } from "next/navigation";

export default function RootPage() {
  // TODO: Quando o Supabase Auth estiver configurado, 
  // checaremos a sessão aqui. Se houver sessão -> redirect('/dashboard')
  
  // Por enquanto, força o usuário ir para a tela de login
  redirect("/login");
}