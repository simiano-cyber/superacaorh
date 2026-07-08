import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Briefcase, Users, Clock, CheckCircle, TrendingUp, AlertTriangle } from "lucide-react";

export default function ParceiroDashboard() {
  return (
    <>
      <DashboardHeader title="Dashboard" subtitle="Acompanhe seus processos seletivos" />

      <div className="p-6 space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">4</p>
              <p className="text-sm text-gray">Vagas abertas</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-gold-dark" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">28</p>
              <p className="text-sm text-gray">Candidatos em processo</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">3</p>
              <p className="text-sm text-gray">Contratações no mês</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center">
              <Clock className="w-6 h-6 text-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">18 dias</p>
              <p className="text-sm text-gray">Tempo médio de contratação</p>
            </div>
          </Card>
        </div>

        {/* SLA e Vagas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vagas ativas */}
          <Card>
            <h2 className="font-bold text-navy mb-4">Vagas em andamento</h2>
            <div className="space-y-3">
              {[
                { title: "Analista de RH Pleno", stage: "Entrevistas", candidates: 8, sla: "No prazo" },
                { title: "Dev Frontend Senior", stage: "Triagem", candidates: 18, sla: "No prazo" },
                { title: "Coordenador Financeiro", stage: "Shortlist", candidates: 3, sla: "Atenção" },
                { title: "Assistente Administrativo", stage: "Entrevista Cliente", candidates: 5, sla: "No prazo" },
              ].map((job, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-line last:border-0">
                  <div>
                    <p className="font-semibold text-navy text-sm">{job.title}</p>
                    <p className="text-xs text-gray">{job.stage} · {job.candidates} candidatos</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    job.sla === "No prazo" ? "bg-green/10 text-green" : "bg-gold/10 text-gold-dark"
                  }`}>
                    {job.sla === "Atenção" && <AlertTriangle className="w-3 h-3" />}
                    {job.sla}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Resumo SLA */}
          <Card>
            <h2 className="font-bold text-navy mb-4">SLA de Atendimento</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Tempo até shortlist</span>
                <span className="text-sm font-bold text-navy">5 dias</span>
              </div>
              <div className="w-full bg-soft rounded-full h-2">
                <div className="bg-green h-2 rounded-full" style={{ width: "70%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Tempo até entrevista</span>
                <span className="text-sm font-bold text-navy">10 dias</span>
              </div>
              <div className="w-full bg-soft rounded-full h-2">
                <div className="bg-gold h-2 rounded-full" style={{ width: "55%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Tempo até contratação</span>
                <span className="text-sm font-bold text-navy">18 dias</span>
              </div>
              <div className="w-full bg-soft rounded-full h-2">
                <div className="bg-navy h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>

              <div className="pt-4 border-t border-line">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green" />
                  <span className="text-sm text-green font-semibold">12% mais rápido que o mês anterior</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
