import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Users, Clock, AlertTriangle } from "lucide-react";

const mockJobs = [
  { id: 1, title: "Analista de RH Pleno", stage: "Entrevistas", candidates: 8, daysOpen: 12, sla: "No prazo" },
  { id: 2, title: "Dev Frontend Senior", stage: "Triagem", candidates: 18, daysOpen: 5, sla: "No prazo" },
  { id: 3, title: "Coordenador Financeiro", stage: "Shortlist", candidates: 3, daysOpen: 22, sla: "Atenção" },
  { id: 4, title: "Assistente Administrativo", stage: "Entrevista Cliente", candidates: 5, daysOpen: 8, sla: "No prazo" },
];

export default function ParceiroVagasPage() {
  return (
    <>
      <DashboardHeader title="Minhas Vagas" subtitle="Vagas abertas pela sua empresa" />

      <div className="p-6 space-y-4">
        {mockJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-navy text-lg">{job.title}</h3>
                <p className="text-sm text-gray">Etapa atual: {job.stage}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-gray">
                  <Users className="w-4 h-4" />
                  <span><strong className="text-navy">{job.candidates}</strong> candidatos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray">
                  <Clock className="w-4 h-4" />
                  <span>{job.daysOpen} dias aberta</span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  job.sla === "No prazo" ? "bg-green/10 text-green" : "bg-gold/10 text-gold-dark"
                }`}>
                  {job.sla === "Atenção" && <AlertTriangle className="w-3 h-3" />}
                  {job.sla}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
