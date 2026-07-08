import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Briefcase, Users, Building2, CheckCircle, Clock, AlertTriangle, Calendar } from "lucide-react";

export default function AdminDashboard() {
  return (
    <>
      <DashboardHeader title="Dashboard" subtitle="Visão geral do recrutamento" />

      <div className="p-6 space-y-6">
        {/* Métricas principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">12</p>
              <p className="text-sm text-gray">Vagas abertas</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-gold-dark" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">248</p>
              <p className="text-sm text-gray">Candidatos ativos</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">8</p>
              <p className="text-sm text-gray">Contratações no mês</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">6</p>
              <p className="text-sm text-gray">Parceiros ativos</p>
            </div>
          </Card>
        </div>

        {/* Vagas recentes + Atividade */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vagas recentes */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy">Vagas recentes</h2>
              <a href="/admin/vagas" className="text-sm text-gold-dark font-semibold hover:underline">
                Ver todas
              </a>
            </div>
            <div className="space-y-3">
              {[
                { title: "Analista de RH Pleno", company: "Tech Corp", candidates: 32, status: "aberta" },
                { title: "Dev Frontend Senior", company: "Inova SA", candidates: 18, status: "aberta" },
                { title: "Coordenador Financeiro", company: "Grupo Beta", candidates: 45, status: "aberta" },
                { title: "Assistente Administrativo", company: "Alpha Ltda", candidates: 67, status: "aberta" },
              ].map((job, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-line last:border-0">
                  <div>
                    <p className="font-semibold text-navy text-sm">{job.title}</p>
                    <p className="text-xs text-gray">{job.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-navy">{job.candidates}</p>
                    <p className="text-xs text-gray">candidatos</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Atividade recente */}
          <Card>
            <h2 className="font-bold text-navy mb-4">Atividade recente</h2>
            <div className="space-y-4">
              {[
                { text: "Maria Silva avançou para Entrevista RH", time: "2h atrás", icon: <Clock className="w-4 h-4" /> },
                { text: "Nova candidatura em Dev Frontend", time: "3h atrás", icon: <Users className="w-4 h-4" /> },
                { text: "Vaga Coordenador: SLA em alerta", time: "5h atrás", icon: <AlertTriangle className="w-4 h-4" /> },
                { text: "Entrevista agendada com João", time: "1d atrás", icon: <Calendar className="w-4 h-4" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-soft flex items-center justify-center text-gray shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-navy">{item.text}</p>
                    <p className="text-xs text-gray">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
