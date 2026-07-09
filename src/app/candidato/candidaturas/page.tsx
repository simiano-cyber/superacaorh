import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Clock, CheckCircle, XCircle } from "lucide-react";

const mockApplications = [
  { id: 1, title: "Analista de RH Pleno", company: "Tech Corp", stage: "Entrevista RH", date: "03/07/2026", status: "em_andamento" },
  { id: 2, title: "Assistente Administrativo", company: "Alpha Ltda", stage: "Triagem", date: "01/07/2026", status: "em_andamento" },
  { id: 3, title: "Coordenador de RH", company: "Inova SA", stage: "Inscrito", date: "28/06/2026", status: "em_andamento" },
  { id: 4, title: "Gerente de Projetos", company: "Grupo Beta", stage: "Reprovado", date: "15/06/2026", status: "reprovado" },
  { id: 5, title: "Analista Financeiro", company: "Tech Corp", stage: "Contratado", date: "10/06/2026", status: "aprovado" },
];

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  em_andamento: { icon: <Clock className="w-4 h-4" />, color: "bg-gold/10 text-gold-dark", label: "Em andamento" },
  aprovado: { icon: <CheckCircle className="w-4 h-4" />, color: "bg-green/10 text-green", label: "Aprovado" },
  reprovado: { icon: <XCircle className="w-4 h-4" />, color: "bg-red-100 text-red-600", label: "Encerrado" },
};

export default function CandidaturasPage() {
  return (
    <>
      <DashboardHeader title="Minhas Candidaturas" subtitle="Acompanhe seus processos seletivos" />

      <div className="p-6 space-y-4">
        {mockApplications.map((app) => {
          const config = statusConfig[app.status];
          return (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-navy">{app.title}</h3>
                  <p className="text-sm text-gray">{app.company}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-navy">{app.stage}</p>
                    <p className="text-xs text-gray">{app.date}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.color}`}>
                    {config.icon}
                    {config.label}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
