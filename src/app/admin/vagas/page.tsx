"use client";

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, Search, Filter, MoreVertical, MapPin, Building2 } from "lucide-react";

const mockJobs = [
  { id: 1, title: "Analista de RH Pleno", company: "Tech Corp", city: "São Paulo", model: "Híbrido", status: "aberta", candidates: 32, created: "03/07/2026" },
  { id: 2, title: "Dev Frontend Senior", company: "Inova SA", city: "Remoto", model: "Remoto", status: "aberta", candidates: 18, created: "01/07/2026" },
  { id: 3, title: "Coordenador Financeiro", company: "Grupo Beta", city: "Campinas", model: "Presencial", status: "aberta", candidates: 45, created: "28/06/2026" },
  { id: 4, title: "Assistente Administrativo", company: "Alpha Ltda", city: "São Paulo", model: "Presencial", status: "pausada", candidates: 67, created: "25/06/2026" },
  { id: 5, title: "Gerente de Projetos", company: "Tech Corp", city: "São Paulo", model: "Híbrido", status: "encerrada", candidates: 53, created: "15/06/2026" },
];

const statusColors: Record<string, string> = {
  aberta: "bg-green/10 text-green",
  pausada: "bg-gold/10 text-gold-dark",
  encerrada: "bg-gray/10 text-gray",
};

export default function VagasPage() {
  const [search, setSearch] = useState("");

  return (
    <>
      <DashboardHeader title="Vagas" subtitle="Gerencie os processos seletivos" />

      <div className="p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
              <input
                type="text"
                placeholder="Buscar vagas..."
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
          <Button size="sm">
            <Plus className="w-4 h-4" />
            Nova vaga
          </Button>
        </div>

        {/* Lista de vagas */}
        <Card padding="sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left p-3 text-xs font-bold text-gray uppercase">Vaga</th>
                  <th className="text-left p-3 text-xs font-bold text-gray uppercase">Empresa</th>
                  <th className="text-left p-3 text-xs font-bold text-gray uppercase">Local</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Candidatos</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Status</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Data</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {mockJobs.map((job) => (
                  <tr key={job.id} className="border-b border-line last:border-0 hover:bg-soft/50 transition-colors">
                    <td className="p-3">
                      <p className="font-semibold text-navy text-sm">{job.title}</p>
                      <p className="text-xs text-gray">{job.model}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray" />
                        <span className="text-sm text-navy">{job.company}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray" />
                        <span className="text-sm text-gray">{job.city}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-sm font-bold text-navy">{job.candidates}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColors[job.status]}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-xs text-gray">{job.created}</span>
                    </td>
                    <td className="p-3 text-center">
                      <button className="w-8 h-8 rounded-lg hover:bg-soft flex items-center justify-center cursor-pointer">
                        <MoreVertical className="w-4 h-4 text-gray" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
