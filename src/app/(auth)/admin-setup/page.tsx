"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Shield } from "lucide-react";

// Código secreto para criar admin - mude este valor
const ADMIN_SECRET = "superacao2026";

export default function AdminSetupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [secret, setSecret] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (secret !== ADMIN_SECRET) {
      setError("Código de acesso inválido.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "admin",
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-soft p-4">
        <div className="w-full max-w-md bg-white rounded-xl border border-line shadow-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-green" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">Admin criado!</h1>
          <p className="text-gray mb-4">
            Verifique seu e-mail para confirmar a conta. Depois acesse via login normalmente.
          </p>
          <Button onClick={() => router.push("/login")} className="w-full">
            Ir para o login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-soft p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-line shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">Criar Administrador</h1>
              <p className="text-sm text-gray">Acesso restrito</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              id="secret"
              label="Código de acesso"
              type="password"
              placeholder="Digite o código secreto"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
            />

            <Input
              id="fullName"
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              id="email"
              label="E-mail"
              type="email"
              placeholder="admin@superacaorh.com.br"
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
              Criar conta de administrador
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
