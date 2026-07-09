import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Clock, TrendingUp, Target, CheckCircle } from "lucide-react";

export default function MetricasPage() {
  return (
    <>
      <DashboardHeader title="SLA & Métricas" subtitle="Indicadores de desempenho dos processos" />

      <div className="p-6 space-y-6">
        {/* SLA Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green" />
              </div>
              <p className="text-2xl font-bold text-navy">5 dias</p>
              <p className="text-xs text-gray mt-1">Tempo até shortlist</p>
              <p className="text-xs text-green font-semibold mt-2">✓ Dentro do SLA</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-gold-dark" />
              </div>
              <p className="text-2xl font-bold text-navy">10 dias</p>
              <p className="text-xs text-gray mt-1">Tempo até entrevista</p>
              <p className="text-xs text-gold-dark font-semibold mt-2">⚠ Próximo do limite</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-navy" />
              </div>
              <p className="text-2xl font-bold text-navy">18 dias</p>
              <p className="text-xs text-gray mt-1">Tempo até contratação</p>
              <p className="text-xs text-green font-semibold mt-2">✓ Dentro do SLA</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green" />
              </div>
              <p className="text-2xl font-bold text-navy">92%</p>
              <p className="text-xs text-gray mt-1">Satisfação geral</p>
              <p className="text-xs text-green font-semibold mt-2">↑ 8% vs mês anterior</p>
            </div>
          </Card>
        </div>

        {/* Histórico */}
        <Card>
          <h2 className="font-bold text-navy mb-4">Histórico de Contratações</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left p-3 text-xs font-bold text-gray uppercase">Vaga</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Contratado</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Tempo</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Candidatos</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Data</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { job: "Analista Financeiro", hired: "Pedro Souza", time: "14 dias", candidates: 23, date: "Jun/2026" },
                  { job: "Dev Backend", hired: "Lucas Mendes", time: "21 dias", candidates: 35, date: "Mai/2026" },
                  { job: "Coordenador de RH", hired: "Ana Clara", time: "18 dias", candidates: 28, date: "Abr/2026" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="p-3 font-semibold text-navy text-sm">{row.job}</td>
                    <td className="p-3 text-center text-sm">{row.hired}</td>
                    <td className="p-3 text-center text-sm">{row.time}</td>
                    <td className="p-3 text-center text-sm">{row.candidates}</td>
                    <td className="p-3 text-center text-sm text-gray">{row.date}</td>
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
