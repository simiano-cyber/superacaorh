"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    // Buscar perfil para redirecionar ao portal correto
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        router.push("/admin");
      } else if (profile?.role === "parceiro") {
        router.push("/parceiro");
      } else {
        router.push("/candidato");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-soft p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <img
              src="/images/logo-superacao-rh-horizontal.png"
              alt="SuperAção RH"
              className="h-16 mx-auto mb-4"
            />
          </Link>
          <p className="text-gray text-sm">Sistema de Gestão em Recrutamento</p>
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-xl border border-line shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
              <LogIn className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">Entrar</h1>
              <p className="text-sm text-gray">Acesse sua conta</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              label="Senha"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Entrar
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-line text-center space-y-3">
            <Link
              href="/registro"
              className="text-sm text-navy font-bold hover:text-gold-dark transition-colors"
            >
              Não tem conta? Cadastre-se
            </Link>
            <br />
            <Link
              href="/recuperar-senha"
              className="text-sm text-gray hover:text-navy transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>
        </div>

        {/* Link para voltar ao site */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray hover:text-navy transition-colors">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}
