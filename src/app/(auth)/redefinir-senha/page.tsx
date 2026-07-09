"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Lock, CheckCircle } from "lucide-react";

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message || "Erro ao redefinir senha.");
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
            <CheckCircle className="w-8 h-8 text-green" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">Senha redefinida!</h1>
          <p className="text-gray mb-6">Sua senha foi alterada com sucesso. Faça login com a nova senha.</p>
          <Button onClick={() => router.push("/login")} className="w-full">Ir para o login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-soft p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/images/logo-superacao-rh-horizontal.png" alt="SuperAção RH" className="h-16 mx-auto mb-4" />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-line shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">Nova senha</h1>
              <p className="text-sm text-gray">Defina sua nova senha</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="password"
              label="Nova senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Input
              id="confirmPassword"
              label="Confirmar nova senha"
              type="password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Redefinir senha
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
