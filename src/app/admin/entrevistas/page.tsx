"use client";

import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, Calendar, Clock, MapPin, User } from "lucide-react";

const mockInterviews = [
  { id: 1, candidate: "Maria Silva", job: "Analista de RH Pleno", type: "Entrevista RH", date: "10/07/2026", time: "14:00", location: "Google Meet", status: "agendada" },
  { id: 2, candidate: "João Santos", job: "Dev Frontend Senior", type: "Entrevista Técnica", date: "11/07/2026", time: "10:00", location: "Presencial - Sala 3", status: "agendada" },
  { id: 3, candidate: "Ana Oliveira", job: "Coordenador Financeiro", type: "Entrevista Cliente", date: "12/07/2026", time: "15:30", location: "Zoom", status: "agendada" },
  { id: 4, candidate: "Pedro Costa", job: "Assistente Administrativo", type: "Entrevista RH", date: "08/07/2026", time: "09:00", location: "Google Meet", status: "realizada" },
  { id: 5, candidate: "Carla Dias", job: "Gerente de Projetos", type: "Entrevista Final", date: "07/07/2026", time: "11:00", location: "Presencial - Sala 1", status: "realizada" },
];

const statusColors: Record<string, string> = {
  agendada: "bg-gold/10 text-gold-dark",
  realizada: "bg-green/10 text-green",
  cancelada: "bg-red-100 text-red-600",
};

export default function EntrevistasPage() {
  return (
    <>
      <DashboardHeader title="Entrevistas" subtitle="Agende e acompanhe as entrevistas" />

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-navy">Próximas entrevistas</h2>
          <Button size="sm">
            <Plus className="w-4 h-4" />
            Agendar entrevista
          </Button>
        </div>

        <div className="space-y-3">
          {mockInterviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {interview.candidate.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{interview.candidate}</p>
                    <p className="text-xs text-gray">{interview.job}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {interview.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {interview.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {interview.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {interview.location}
                  </span>
                </div>

                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold capitalize shrink-0 ${statusColors[interview.status]}`}>
                  {interview.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
