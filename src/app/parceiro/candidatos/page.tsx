"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Loader2, ThumbsUp, ThumbsDown, MapPin, Mail, Briefcase, CheckCircle, XCircle } from "lucide-react";

export default function ParceiroCandidatosPage() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState<{ appId: string; action: "approve" | "reject" } | null>(null);
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => { loadCandidates(); }, []);

  async function loadCandidates() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Buscar partner_id
    const { data: partner } = await supabase
      .from("partners")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!partner) { setLoading(false); return; }

    // Buscar candidatos em etapas avançadas das vagas do parceiro
    const { data: apps } = await supabase
      .from("applications")
      .select(`
        id, stage, notes, rating, applied_at,
        candidate:candidates(
          id, city, state, salary_expectation, objective,
          profile:profiles(full_name, email, phone),
          skills:candidate_skills(skill_name)
        ),
        job:jobs!inner(id, title, partner_id)
      `)
      .eq("job.partner_id", partner.id)
      .in("stage", ["entrevista_cliente", "entrevista_rh", "teste_tecnico", "aprovado"])
      .order("applied_at", { ascending: false });

    if (apps) setCandidates(apps);
    setLoading(false);
  }

  async function handleDecision() {
    if (!actionModal) return;
    setProcessing(true);

    const newStage = actionModal.action === "approve" ? "aprovado" : "reprovado";

    // Atualizar stage da aplicação
    await supabase.from("applications").update({
      stage: newStage,
      notes: note || null,
    }).eq("id", actionModal.appId);

    // Registrar na timeline
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("application_timeline").insert({
      application_id: actionModal.appId,
      stage: newStage,
      title: actionModal.action === "approve"
        ? "Aprovado pelo parceiro"
        : "Rejeitado pelo parceiro",
      description: note || null,
      created_by: user?.id,
    });

    // Enviar notificação por e-mail ao candidato
    fetch("/api/notifications/stage-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: actionModal.appId,
        newStage,
        note: note || null,
      }),
    }).catch(() => {});

    // Atualizar UI
    setCandidates(prev => prev.filter(c => c.id !== actionModal.appId));
    setActionModal(null);
    setNote("");
    setProcessing(false);
  }

  const stageLabels: Record<string, string> = {
    entrevista_rh: "Entrevista RH",
    entrevista_cliente: "Entrevista Cliente",
    teste_tecnico: "Teste Técnico",
    aprovado: "Aprovado",
  };

  if (loading) {
    return (<><DashboardHeader title="Candidatos" subtitle="Carregando..." /><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div></>);
  }

  return (
    <>
      <DashboardHeader title="Candidatos Pré-selecionados" subtitle="Avalie os candidatos para suas vagas" />

      <div className="p-6 space-y-4">
        {candidates.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray">Nenhum candidato pré-selecionado para suas vagas no momento.</p>
            <p className="text-sm text-gray mt-2">Quando a equipe da SuperAção RH selecionar candidatos para suas vagas, eles aparecerão aqui.</p>
          </Card>
        )}

        {candidates.map((app) => {
          const profile = app.candidate?.profile;
          const skills = app.candidate?.skills || [];

          return (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Info do candidato */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-white font-bold shrink-0">
                    {profile?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-navy text-lg">{profile?.full_name || "Candidato"}</h3>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gold/10 text-gold-dark">
                        {stageLabels[app.stage] || app.stage}
                      </span>
                    </div>
                    <p className="text-sm text-gray mt-1">Vaga: <strong>{app.job?.title}</strong></p>

                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray">
                      {profile?.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {profile.email}</span>}
                      {app.candidate?.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {app.candidate.city}{app.candidate.state ? `, ${app.candidate.state}` : ""}</span>}
                      {app.candidate?.salary_expectation && <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> R$ {Number(app.candidate.salary_expectation).toLocaleString("pt-BR")}</span>}
                    </div>

                    {app.candidate?.objective && (
                      <p className="text-sm text-gray mt-2 italic">"{app.candidate.objective}"</p>
                    )}

                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {skills.slice(0, 6).map((s: any) => (
                          <span key={s.skill_name} className="px-2 py-0.5 bg-soft rounded text-xs font-medium text-navy">{s.skill_name}</span>
                        ))}
                        {skills.length > 6 && <span className="px-2 py-0.5 bg-soft rounded text-xs text-gray">+{skills.length - 6}</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="border-green text-green hover:bg-green/10"
                    onClick={() => setActionModal({ appId: app.id, action: "approve" })}
                  >
                    <ThumbsUp className="w-4 h-4" /> Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => setActionModal({ appId: app.id, action: "reject" })}
                  >
                    <ThumbsDown className="w-4 h-4" /> Rejeitar
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal de confirmação */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setActionModal(null); setNote(""); }} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              {actionModal.action === "approve" ? (
                <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-navy text-lg">
                  {actionModal.action === "approve" ? "Aprovar candidato" : "Rejeitar candidato"}
                </h3>
                <p className="text-sm text-gray">
                  {actionModal.action === "approve"
                    ? "O candidato será marcado como aprovado e a equipe seguirá com a proposta."
                    : "O candidato será removido deste processo seletivo."}
                </p>
              </div>
            </div>

            <textarea
              placeholder="Observação (opcional) — ex: motivo da decisão, feedback..."
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical mb-4"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setActionModal(null); setNote(""); }}
                className="px-4 py-2 rounded-lg text-sm font-bold text-gray hover:bg-soft transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDecision}
                disabled={processing}
                className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-50 ${
                  actionModal.action === "approve" ? "bg-green hover:bg-green/90" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {processing ? "Processando..." : actionModal.action === "approve" ? "Confirmar aprovação" : "Confirmar rejeição"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
