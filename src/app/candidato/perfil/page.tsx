"use client";

import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Save } from "lucide-react";

export default function PerfilPage() {
  return (
    <>
      <DashboardHeader title="Meu Perfil" subtitle="Gerencie suas informações de acesso" />

      <div className="p-6 space-y-6 max-w-2xl">
        <Card>
          <h2 className="font-bold text-navy mb-4">Informações da Conta</h2>
          <div className="space-y-4">
            <Input id="name" label="Nome completo" placeholder="Seu nome" />
            <Input id="email" label="E-mail" type="email" placeholder="seu@email.com" disabled />
            <Input id="phone" label="Telefone" placeholder="(11) 99999-9999" />
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-navy mb-4">Alterar Senha</h2>
          <div className="space-y-4">
            <Input id="currentPassword" label="Senha atual" type="password" placeholder="••••••••" />
            <Input id="newPassword" label="Nova senha" type="password" placeholder="••••••••" />
            <Input id="confirmPassword" label="Confirmar nova senha" type="password" placeholder="••••••••" />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button>
            <Save className="w-4 h-4" />
            Salvar alterações
          </Button>
        </div>
      </div>
    </>
  );
}
