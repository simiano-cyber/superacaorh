"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { UserPlus, Users, Building2, Briefcase } from "lucide-react";

type Role = "candidato" | "parceiro";

export default function RegistroPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<"role" | "form">("role");
  const [role, setRole] = useState<Role>("candidato");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
          company_name: role === "parceiro" ? companyName : undefined,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/registro/confirmacao");
  }

  if (step === "role") {
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
            <h1 className="text-2xl font-bold text-navy mb-2">Criar conta</h1>
            <p className="text-gray">Como você deseja se cadastrar?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Candidato */}
            <button
              onClick={() => { setRole("candidato"); setStep("form"); }}
              className="bg-white rounded-xl border-2 border-line p-6 text-left hover:border-gold hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mb-4 transition-colors">
                <Users className="w-6 h-6 text-navy" />
              </div>
              <h2 className="text-lg font-bold text-navy mb-1">Candidato</h2>
              <p className="text-sm text-gray">
                Cadastre seu currículo e candidate-se a vagas
              </p>
            </button>

            {/* Parceiro */}
            <button
              onClick={() => { setRole("parceiro"); setStep("form"); }}
              className="bg-white rounded-xl border-2 border-line p-6 text-left hover:border-gold hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mb-4 transition-colors">
                <Building2 className="w-6 h-6 text-navy" />
              </div>
              <h2 className="text-lg font-bold text-navy mb-1">Empresa parceira</h2>
              <p className="text-sm text-gray">
                Acompanhe suas vagas e o andamento dos processos
              </p>
            </button>
          </div>

          <div className="text-center mt-6">
            <Link href="/login" className="text-sm text-gray hover:text-navy transition-colors">
              Já tem conta? Fazer login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        </div>

        <div className="bg-white rounded-xl border border-line shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">
                Cadastro de {role === "candidato" ? "Candidato" : "Parceiro"}
              </h1>
              <p className="text-sm text-gray">Preencha seus dados</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              id="fullName"
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            {role === "parceiro" && (
              <Input
                id="companyName"
                label="Nome da empresa"
                type="text"
                placeholder="Nome da sua empresa"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            )}

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Criar conta
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setStep("role")}
              className="text-sm text-gray hover:text-navy transition-colors cursor-pointer"
            >
              ← Voltar e escolher outro tipo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
