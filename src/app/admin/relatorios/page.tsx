import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { BarChart3, TrendingUp, Clock, Users, Briefcase, CheckCircle } from "lucide-react";

export default function RelatoriosPage() {
  return (
    <>
      <DashboardHeader title="Relatórios" subtitle="Métricas e indicadores de recrutamento" />

      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center">
                <Clock className="w-5 h-5 text-navy" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">18 dias</p>
                <p className="text-xs text-gray">Tempo médio de contratação</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-green">
              <TrendingUp className="w-3 h-3" />
              <span>12% mais rápido que mês anterior</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-gold-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">4.2</p>
                <p className="text-xs text-gray">Candidatos por vaga (shortlist)</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-green">
              <TrendingUp className="w-3 h-3" />
              <span>Dentro da meta (3-5)</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">87%</p>
                <p className="text-xs text-gray">Taxa de aprovação no período de experiência</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-green">
              <TrendingUp className="w-3 h-3" />
              <span>5% acima da meta</span>
            </div>
          </Card>
        </div>

        {/* Vagas por status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-bold text-navy mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Vagas por Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Abertas</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-soft rounded-full h-2">
                    <div className="bg-green h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-navy w-6">12</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Pausadas</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-soft rounded-full h-2">
                    <div className="bg-gold h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-navy w-6">3</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Encerradas (mês)</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-soft rounded-full h-2">
                    <div className="bg-navy h-2 rounded-full" style={{ width: "40%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-navy w-6">8</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-bold text-navy mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Pipeline de Candidatos
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Inscritos</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-soft rounded-full h-2">
                    <div className="bg-gray h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-navy w-6">248</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Triagem</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-soft rounded-full h-2">
                    <div className="bg-navy h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-navy w-6">112</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Entrevista RH</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-soft rounded-full h-2">
                    <div className="bg-gold h-2 rounded-full" style={{ width: "18%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-navy w-6">45</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Entrevista Cliente</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-soft rounded-full h-2">
                    <div className="bg-gold-dark h-2 rounded-full" style={{ width: "8%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-navy w-6">20</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Aprovados</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-soft rounded-full h-2">
                    <div className="bg-green h-2 rounded-full" style={{ width: "5%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-navy w-6">12</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Parceiros */}
        <Card>
          <h2 className="font-bold text-navy mb-4">Desempenho por Parceiro</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left p-3 text-xs font-bold text-gray uppercase">Empresa</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Vagas</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Contratações</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Tempo médio</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">SLA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { company: "Tech Corp", jobs: 5, hires: 3, time: "15 dias", sla: "No prazo" },
                  { company: "Inova SA", jobs: 3, hires: 2, time: "20 dias", sla: "No prazo" },
                  { company: "Grupo Beta", jobs: 4, hires: 2, time: "25 dias", sla: "Atenção" },
                  { company: "Alpha Ltda", jobs: 2, hires: 1, time: "12 dias", sla: "No prazo" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="p-3 font-semibold text-navy text-sm">{row.company}</td>
                    <td className="p-3 text-center text-sm">{row.jobs}</td>
                    <td className="p-3 text-center text-sm">{row.hires}</td>
                    <td className="p-3 text-center text-sm">{row.time}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${row.sla === "No prazo" ? "bg-green/10 text-green" : "bg-gold/10 text-gold-dark"}`}>
                        {row.sla}
                      </span>
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
