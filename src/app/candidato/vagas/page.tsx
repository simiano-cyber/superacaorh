"use client";

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Search, MapPin, Building2, Clock, Briefcase } from "lucide-react";

const mockJobs = [
  { id: 1, title: "Analista de RH Pleno", company: "Tech Corp", city: "São Paulo, SP", model: "Híbrido", contract: "CLT", salary: "R$ 5.000 - R$ 7.000", description: "Atuar em processos de recrutamento e seleção, treinamento e desenvolvimento.", posted: "3 dias atrás" },
  { id: 2, title: "Dev Frontend Senior", company: "Inova SA", city: "Remoto", model: "Remoto", contract: "PJ", salary: "R$ 12.000 - R$ 16.000", description: "Desenvolvimento de interfaces com React e TypeScript.", posted: "5 dias atrás" },
  { id: 3, title: "Coordenador Financeiro", company: "Grupo Beta", city: "Campinas, SP", model: "Presencial", contract: "CLT", salary: "R$ 8.000 - R$ 12.000", description: "Coordenar equipe financeira e processos de controladoria.", posted: "1 semana atrás" },
  { id: 4, title: "Assistente Administrativo", company: "Alpha Ltda", city: "São Paulo, SP", model: "Presencial", contract: "CLT", salary: "R$ 2.500 - R$ 3.200", description: "Apoio administrativo geral, organização de documentos e atendimento.", posted: "2 semanas atrás" },
];

export default function VagasCandidatoPage() {
  const [search, setSearch] = useState("");

  return (
    <>
      <DashboardHeader title="Vagas Disponíveis" subtitle="Encontre sua próxima oportunidade" />

      <div className="p-6 space-y-4">
        {/* Busca */}
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
          <input
            type="text"
            placeholder="Buscar por cargo, empresa ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        {/* Lista de vagas */}
        <div className="space-y-4">
          {mockJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-navy">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.contract} · {job.model}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.posted}
                    </span>
                  </div>
                  <p className="text-sm text-gray mt-3">{job.description}</p>
                  <p className="text-sm font-bold text-gold-dark mt-2">{job.salary}</p>
                </div>
                <Button size="sm" className="shrink-0">
                  Candidatar-se
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
