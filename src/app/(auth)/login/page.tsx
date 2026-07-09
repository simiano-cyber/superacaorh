"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { LogIn, Users, Building2, Shield } from "lucide-react";

type AccessType = "candidato" | "parceiro" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [accessType, setAccessType] = useState<AccessType>("candidato");
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

    // Redirecionar baseado na escolha
    if (accessType === "admin") {
      router.push("/admin");
    } else if (accessType === "parceiro") {
      router.push("/parceiro");
    } else {
      router.push("/candidato");
    }
  }

  if (step === "choose") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-soft p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Link href="/">
              <img
                src="/images/logo-superacao-rh-horizontal.png"
                alt="SuperAção RH"
                className="h-16 mx-auto mb-4"
              />
            </Link>
            <p className="text-gray text-sm">Sistema de Gestão em Recrutamento</p>
            <h1 className="text-2xl font-bold text-navy mt-4">Como deseja acessar?</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Candidato */}
            <button
              onClick={() => { setAccessType("candidato"); setStep("form"); }}
              className="bg-white rounded-xl border-2 border-line p-6 text-center hover:border-gold hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mx-auto mb-4 transition-colors">
                <Users className="w-6 h-6 text-navy" />
              </div>
              <h2 className="text-sm font-bold text-navy mb-1">Candidato</h2>
              <p className="text-xs text-gray">Acesse seu currículo e vagas</p>
            </button>

            {/* Parceiro */}
            <button
              onClick={() => { setAccessType("parceiro"); setStep("form"); }}
              className="bg-white rounded-xl border-2 border-line p-6 text-center hover:border-gold hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mx-auto mb-4 transition-colors">
                <Building2 className="w-6 h-6 text-navy" />
              </div>
              <h2 className="text-sm font-bold text-navy mb-1">Empresa Parceira</h2>
              <p className="text-xs text-gray">Acompanhe suas vagas</p>
            </button>

            {/* Colaborador/Admin */}
            <button
              onClick={() => { setAccessType("admin"); setStep("form"); }}
              className="bg-white rounded-xl border-2 border-line p-6 text-center hover:border-gold hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mx-auto mb-4 transition-colors">
                <Shield className="w-6 h-6 text-navy" />
              </div>
              <h2 className="text-sm font-bold text-navy mb-1">Colaborador</h2>
              <p className="text-xs text-gray">Acesso administrativo</p>
            </button>
          </div>

          <div className="text-center mt-6 space-y-3">
            <Link
              href="/registro"
              className="text-sm text-navy font-bold hover:text-gold-dark transition-colors"
            >
              Não tem conta? Cadastre-se
            </Link>
          </div>

          <div className="text-center mt-4">
            <Link href="/" className="text-sm text-gray hover:text-navy transition-colors">
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const titles: Record<AccessType, string> = {
    candidato: "Acesso Candidato",
    parceiro: "Acesso Empresa Parceira",
    admin: "Acesso Colaborador",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-soft p-4">
      <div className="w-full max-w-md">
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

        <div className="bg-white rounded-xl border border-line shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
              <LogIn className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">{titles[accessType]}</h1>
              <p className="text-sm text-gray">Digite suas credenciais</p>
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
            <button
              onClick={() => setStep("choose")}
              className="text-sm text-gray hover:text-navy transition-colors cursor-pointer"
            >
              ← Voltar e escolher outro acesso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
