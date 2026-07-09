"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { KeyRound, CheckCircle } from "lucide-react";

export default function RecuperarSenhaPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://www.superacaorh.com.br/redefinir-senha",
    });

    if (resetError) {
      setError(resetError.message || "Erro ao enviar e-mail.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-soft p-4">
        <div className="w-full max-w-md bg-white rounded-xl border border-line shadow-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">E-mail enviado!</h1>
          <p className="text-gray mb-6">
            Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir sua senha.
          </p>
          <Link href="/login">
            <Button variant="ghost" className="w-full">Voltar ao login</Button>
          </Link>
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
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">Recuperar senha</h1>
              <p className="text-sm text-gray">Enviaremos um link para seu e-mail</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="E-mail cadastrado"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Enviar link de recuperação
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-line text-center">
            <Link href="/login" className="text-sm text-gray hover:text-navy transition-colors">
              ← Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
