import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { FileText, Briefcase, ClipboardList, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CandidatoDashboard() {
  return (
    <>
      <DashboardHeader title="Bem-vindo(a)!" subtitle="Acompanhe suas oportunidades" />

      <div className="p-6 space-y-6">
        {/* Cards de ações rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/candidato/curriculo">
            <Card className="hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-lg bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mb-3 transition-colors">
                <FileText className="w-5 h-5 text-navy" />
              </div>
              <p className="font-bold text-navy text-sm">Meu Currículo</p>
              <p className="text-xs text-gray mt-1">Mantenha seus dados atualizados</p>
            </Card>
          </Link>

          <Link href="/candidato/vagas">
            <Card className="hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-lg bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mb-3 transition-colors">
                <Briefcase className="w-5 h-5 text-navy" />
              </div>
              <p className="font-bold text-navy text-sm">Vagas Abertas</p>
              <p className="text-xs text-gray mt-1">12 vagas disponíveis</p>
            </Card>
          </Link>

          <Link href="/candidato/candidaturas">
            <Card className="hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-lg bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mb-3 transition-colors">
                <ClipboardList className="w-5 h-5 text-navy" />
              </div>
              <p className="font-bold text-navy text-sm">Candidaturas</p>
              <p className="text-xs text-gray mt-1">3 processos em andamento</p>
            </Card>
          </Link>

          <Card className="border-green/20 bg-green/5">
            <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 text-green" />
            </div>
            <p className="font-bold text-navy text-sm">Perfil Completo</p>
            <p className="text-xs text-gray mt-1">Seu currículo está 85% preenchido</p>
          </Card>
        </div>

        {/* Candidaturas recentes */}
        <Card>
          <h2 className="font-bold text-navy mb-4">Minhas candidaturas recentes</h2>
          <div className="space-y-3">
            {[
              { title: "Analista de RH Pleno", company: "Tech Corp", stage: "Entrevista RH", date: "03/07/2026" },
              { title: "Assistente Administrativo", company: "Alpha Ltda", stage: "Triagem", date: "01/07/2026" },
              { title: "Coordenador de RH", company: "Inova SA", stage: "Inscrito", date: "28/06/2026" },
            ].map((app, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-line last:border-0">
                <div>
                  <p className="font-semibold text-navy text-sm">{app.title}</p>
                  <p className="text-xs text-gray">{app.company}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-gold/10 text-gold-dark">
                    {app.stage}
                  </span>
                  <p className="text-xs text-gray mt-1">{app.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
