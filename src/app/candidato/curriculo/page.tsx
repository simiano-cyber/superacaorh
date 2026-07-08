"use client";

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Save, Plus, Trash2 } from "lucide-react";

export default function CurriculoPage() {
  const [saving, setSaving] = useState(false);

  return (
    <>
      <DashboardHeader title="Meu Currículo" subtitle="Mantenha seus dados atualizados para as vagas" />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Dados pessoais */}
        <Card>
          <h2 className="font-bold text-navy mb-4">Dados Pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="fullName" label="Nome completo" placeholder="Seu nome" />
            <Input id="phone" label="Telefone" placeholder="(11) 99999-9999" />
            <Input id="city" label="Cidade" placeholder="São Paulo" />
            <Input id="state" label="Estado" placeholder="SP" />
            <Input id="linkedin" label="LinkedIn" placeholder="https://linkedin.com/in/seu-perfil" />
            <Input id="portfolio" label="Portfólio / Site" placeholder="https://seusite.com" />
          </div>
          <div className="mt-4">
            <label className="text-sm font-bold text-navy block mb-1.5">Objetivo profissional</label>
            <textarea
              placeholder="Descreva brevemente seu objetivo profissional..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input id="salary" label="Pretensão salarial" placeholder="R$ 5.000" type="text" />
            <Input id="availability" label="Disponibilidade" placeholder="Imediata / 30 dias" />
          </div>
        </Card>

        {/* Experiência */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy">Experiência Profissional</h2>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-line rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-navy text-sm">Analista de RH</p>
                  <p className="text-xs text-gray">Empresa ABC · Jan 2023 - Atual</p>
                </div>
                <button className="text-gray hover:text-red-500 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray mt-2">
                Responsável por processos de recrutamento e seleção, treinamentos e gestão de benefícios.
              </p>
            </div>
          </div>
        </Card>

        {/* Formação */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy">Formação Acadêmica</h2>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-line rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-navy text-sm">Administração de Empresas</p>
                  <p className="text-xs text-gray">Universidade XYZ · 2018 - 2022 · Graduação</p>
                </div>
                <button className="text-gray hover:text-red-500 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Habilidades */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy">Habilidades</h2>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Recrutamento e Seleção", "Excel Avançado", "Pacote Office", "Gestão de Pessoas", "Comunicação"].map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-soft rounded-lg text-sm font-medium text-navy">
                {skill}
                <button className="text-gray hover:text-red-500 cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </Card>

        {/* Upload de CV */}
        <Card>
          <h2 className="font-bold text-navy mb-4">Currículo em PDF</h2>
          <div className="border-2 border-dashed border-line rounded-lg p-8 text-center">
            <p className="text-sm text-gray mb-3">Arraste seu arquivo ou clique para selecionar</p>
            <Button variant="ghost" size="sm">Selecionar arquivo</Button>
            <p className="text-xs text-gray mt-2">PDF, máximo 5MB</p>
          </div>
        </Card>

        {/* Salvar */}
        <div className="flex justify-end">
          <Button loading={saving} onClick={() => setSaving(true)}>
            <Save className="w-4 h-4" />
            Salvar currículo
          </Button>
        </div>
      </div>
    </>
  );
}
