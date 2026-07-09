"use client";

import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Save } from "lucide-react";

export default function ConfiguracoesPage() {
  return (
    <>
      <DashboardHeader title="Configurações" subtitle="Personalize o sistema" />

      <div className="p-6 space-y-6 max-w-3xl">
        <Card>
          <h2 className="font-bold text-navy mb-4">Dados da Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="companyName" label="Nome da empresa" defaultValue="SuperAção RH" />
            <Input id="cnpj" label="CNPJ" placeholder="00.000.000/0001-00" />
            <Input id="phone" label="Telefone" placeholder="(11) 99999-9999" />
            <Input id="email" label="E-mail" defaultValue="contato@superacaorh.com.br" />
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-navy mb-4">Configurações de E-mail</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="smtpHost" label="SMTP Host" placeholder="smtp.gmail.com" />
            <Input id="smtpPort" label="Porta" placeholder="587" />
            <Input id="smtpUser" label="Usuário" placeholder="seu@email.com" />
            <Input id="smtpPass" label="Senha" type="password" placeholder="••••••••" />
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-navy mb-4">Etapas do Processo Seletivo</h2>
          <p className="text-sm text-gray mb-4">Defina as etapas padrão do pipeline de recrutamento.</p>
          <div className="space-y-2">
            {["Inscrito", "Triagem", "Entrevista RH", "Entrevista Cliente", "Teste Técnico", "Aprovado", "Contratado"].map((stage, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-soft rounded-lg">
                <span className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-navy">{stage}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button>
            <Save className="w-4 h-4" />
            Salvar configurações
          </Button>
        </div>
      </div>
    </>
  );
}
