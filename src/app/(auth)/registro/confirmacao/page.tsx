import Link from "next/link";
import { MailCheck } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ConfirmacaoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-soft p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-xl border border-line shadow-lg p-8">
          <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-6">
            <MailCheck className="w-8 h-8 text-green" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">Verifique seu e-mail</h1>
          <p className="text-gray mb-6">
            Enviamos um link de confirmação para o seu e-mail. Clique nele para ativar sua conta.
          </p>
          <Link href="/login">
            <Button variant="ghost" className="w-full">
              Ir para o login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
