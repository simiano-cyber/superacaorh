"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { ApplicationStage } from "@/lib/types";

const stageLabels: Record<ApplicationStage, { label: string; color: string }> = {
  inscrito: { label: "Inscrito", color: "bg-gray/10 text-gray" },
  triagem: { label: "Triagem", color: "bg-navy/10 text-navy" },
  entrevista_rh: { label: "Entrevista RH", color: "bg-gold/10 text-gold-dark" },
  entrevista_cliente: { label: "Entrevista Cliente", color: "bg-gold/20 text-gold-dark" },
  teste_tecnico: { label: "Teste Técnico", color: "bg-navy/10 text-navy" },
  aprovado: { label: "Aprovado", color: "bg-green/10 text-green" },
  reprovado: { label: "Não selecionado", color: "bg-red-100 text-red-600" },
  contratado: { label: "Contratado", color: "bg-green/20 text-green" },
  desistente: { label: "Desistente", color: "bg-gray/10 text-gray" },
};

export default function CandidaturasPage() {
  const supabase = createClient();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Buscar candidato
    const { data: candidate } = await supabase
      .from("candidates")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!candidate) {
      setLoading(false);
      return;
    }

    // Buscar candidaturas
    const { data } = await supabase
      .from("applications")
      .select("*, job:jobs(title, city, contract_type, partner:partners(company_name))")
      .eq("candidate_id", candidate.id)
      .order("applied_at", { ascending: false });

    if (data) setApplications(data);
    setLoading(false);
  }

  function getStatusIcon(stage: ApplicationStage) {
    if (stage === "contratado" || stage === "aprovado") return <CheckCircle className="w-4 h-4" />;
    if (stage === "reprovado") return <XCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  }

  if (loading) {
    return (
      <>
        <DashboardHeader title="Minhas Candidaturas" subtitle="Carregando..." />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-gray" />
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Minhas Candidaturas" subtitle="Acompanhe seus processos seletivos" />

      <div className="p-6 space-y-4">
        {applications.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray">Você ainda não se candidatou a nenhuma vaga.</p>
          </Card>
        )}

        {applications.map((app) => {
          const stageInfo = stageLabels[app.stage as ApplicationStage] || { label: app.stage, color: "bg-gray/10 text-gray" };
          const stageOrder = ["inscrito", "triagem", "entrevista_rh", "entrevista_cliente", "teste_tecnico", "aprovado", "contratado"];
          const currentIndex = stageOrder.indexOf(app.stage);
          const progress = app.stage === "reprovado" ? 0 : Math.round(((currentIndex + 1) / stageOrder.length) * 100);

          return (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-navy">{app.job?.title || "Vaga"}</h3>
                  <p className="text-sm text-gray">
                    {app.job?.partner?.company_name || ""}
                    {app.job?.city ? ` · ${app.job.city}` : ""}
                    {app.job?.contract_type ? ` · ${app.job.contract_type}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${stageInfo.color}`}>
                    {getStatusIcon(app.stage)}
                    {stageInfo.label}
                  </span>
                </div>
              </div>
              {/* Barra de progresso */}
              {app.stage !== "reprovado" && app.stage !== "desistente" && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray">Progresso</span>
                    <span className="text-xs font-bold text-navy">{progress}%</span>
                  </div>
                  <div className="w-full bg-soft rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-gold to-green"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    {stageOrder.map((s, i) => (
                      <div key={s} className={`w-2 h-2 rounded-full ${i <= currentIndex ? "bg-gold" : "bg-line"}`} title={stageLabels[s as ApplicationStage]?.label} />
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-gray mt-2">Candidatura em {new Date(app.applied_at).toLocaleDateString("pt-BR")}</p>
            </Card>
          );
        })}
      </div>
    </>
  );
}
