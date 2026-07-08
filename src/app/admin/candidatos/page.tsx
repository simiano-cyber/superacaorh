"use client";

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Search, Filter, Star, MapPin, Mail } from "lucide-react";

const mockCandidates = [
  { id: 1, name: "Maria Silva", role: "Analista de RH", city: "São Paulo, SP", email: "maria@email.com", skills: ["RH", "Recrutamento", "Excel"], rating: 4, stage: "entrevista_rh" },
  { id: 2, name: "João Santos", role: "Dev Frontend", city: "Remoto", email: "joao@email.com", skills: ["React", "TypeScript", "CSS"], rating: 5, stage: "entrevista_cliente" },
  { id: 3, name: "Ana Oliveira", role: "Coordenadora Financeira", city: "Campinas, SP", email: "ana@email.com", skills: ["Finanças", "SAP", "Gestão"], rating: 3, stage: "triagem" },
  { id: 4, name: "Pedro Costa", role: "Assistente Adm", city: "São Paulo, SP", email: "pedro@email.com", skills: ["Office", "Organização"], rating: 4, stage: "inscrito" },
  { id: 5, name: "Carla Dias", role: "Gerente de Projetos", city: "São Paulo, SP", email: "carla@email.com", skills: ["Scrum", "PMI", "Liderança"], rating: 5, stage: "aprovado" },
];

const stageLabels: Record<string, { label: string; color: string }> = {
  inscrito: { label: "Inscrito", color: "bg-gray/10 text-gray" },
  triagem: { label: "Triagem", color: "bg-navy/10 text-navy" },
  entrevista_rh: { label: "Entrevista RH", color: "bg-gold/10 text-gold-dark" },
  entrevista_cliente: { label: "Entrevista Cliente", color: "bg-gold/20 text-gold-dark" },
  aprovado: { label: "Aprovado", color: "bg-green/10 text-green" },
};

export default function CandidatosPage() {
  const [search, setSearch] = useState("");

  return (
    <>
      <DashboardHeader title="Candidatos" subtitle="Base de talentos cadastrados" />

      <div className="p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
            <input
              type="text"
              placeholder="Buscar por nome, habilidade, cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <button className="h-10 px-4 rounded-lg border border-line bg-white flex items-center gap-2 text-sm text-gray hover:bg-soft transition-colors cursor-pointer">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Grid de candidatos */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm">
                    {candidate.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{candidate.name}</p>
                    <p className="text-xs text-gray">{candidate.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < candidate.rating ? "text-gold fill-gold" : "text-gray/30"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-gray">
                  <MapPin className="w-3 h-3" />
                  {candidate.city}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray">
                  <Mail className="w-3 h-3" />
                  {candidate.email}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 bg-soft rounded text-xs font-medium text-navy">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-line">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${stageLabels[candidate.stage]?.color}`}>
                  {stageLabels[candidate.stage]?.label}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
