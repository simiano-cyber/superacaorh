"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Edit, Pause, XCircle, Play, MapPin, Building2, Briefcase, Users, Loader2, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Job, Application, ApplicationStage } from "@/lib/types";

const stages: { key: ApplicationStage; label: string; color: string }[] = [
  { key: "inscrito", label: "Inscritos", color: "bg-gray/10" },
  { key: "triagem", label: "Triagem", color: "bg-navy/10" },
  { key: "entrevista_rh", label: "Entrevista RH", color: "bg-gold/10" },
  { key: "entrevista_cliente", label: "Entrevista Cliente", color: "bg-gold/20" },
  { key: "teste_tecnico", label: "Teste Técnico", color: "bg-navy/5" },
  { key: "aprovado", label: "Aprovados", color: "bg-green/10" },
  { key: "contratado", label: "Contratados", color: "bg-green/20" },
];

const rejectedStages: ApplicationStage[] = ["reprovado", "desistente"];

export default function VagaDetalhePage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    // Carregar vaga
    const { data: jobData } = await supabase
      .from("jobs")
      .select("*, partner:partners(company_name)")
      .eq("id", id)
      .single();

    if (jobData) setJob(jobData as Job);

    // Carregar candidaturas com dados do candidato
    const { data: apps } = await supabase
      .from("applications")
      .select(`
        *,
        candidate:candidates(
          id,
          city,
          state,
          salary_expectation,
          profile:profiles(full_name, email, phone)
        )
      `)
      .eq("job_id", id)
      .not("stage", "in", `(${rejectedStages.join(",")})`)
      .order("applied_at", { ascending: false });

    if (apps) setApplications(apps);
    setLoading(false);
  }

  const [noteModal, setNoteModal] = useState<{ appId: string; action: "advance" | "reject"; nextStage?: ApplicationStage } | null>(null);
  const [note, setNote] = useState("");

  async function moveCandidate(applicationId: string, newStage: ApplicationStage, description?: string) {
    setUpdating(applicationId);

    const { error } = await supabase
      .from("applications")
      .update({ stage: newStage })
      .eq("id", applicationId);

    if (!error) {
      // Registrar na timeline
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("application_timeline").insert({
        application_id: applicationId,
        stage: newStage,
        title: `Movido para ${stages.find(s => s.key === newStage)?.label || newStage}`,
        description: description || null,
        created_by: user?.id,
      });

      // Atualizar lista
      setApplications(apps =>
        apps.map(a => a.id === applicationId ? { ...a, stage: newStage } : a)
      );
    }
    setUpdating(null);
    setNoteModal(null);
    setNote("");
  }

  async function rejectCandidate(applicationId: string, description?: string) {
    setUpdating(applicationId);
    await supabase
      .from("applications")
      .update({ stage: "reprovado" })
      .eq("id", applicationId);

    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("application_timeline").insert({
      application_id: applicationId,
      stage: "reprovado",
      title: "Reprovado no processo",
      description: description || null,
      created_by: user?.id,
    });

    setApplications(apps => apps.filter(a => a.id !== applicationId));
    setUpdating(null);
    setNoteModal(null);
    setNote("");
  }

  async function updateJobStatus(status: "aberta" | "pausada" | "encerrada") {
    await supabase.from("jobs").update({ status }).eq("id", id);
    setJob(prev => prev ? { ...prev, status } : null);
  }

  if (loading) {
    return (
      <>
        <DashboardHeader title="Carregando..." subtitle="" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-gray" />
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <DashboardHeader title="Vaga não encontrada" subtitle="" />
        <div className="p-6">
          <Link href="/admin/vagas">
            <Button variant="ghost"><ArrowLeft className="w-4 h-4" /> Voltar</Button>
          </Link>
        </div>
      </>
    );
  }

  function getNextStage(current: ApplicationStage): ApplicationStage | null {
    const idx = stages.findIndex(s => s.key === current);
    if (idx >= 0 && idx < stages.length - 1) return stages[idx + 1].key;
    return null;
  }

  return (
    <>
      <DashboardHeader title={job.title} subtitle={`${(job.partner as any)?.company_name || "Sem empresa"} · ${job.city || ""}`} />

      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/vagas">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> Voltar</Button>
          </Link>
          <div className="flex-1" />
          {job.status === "aberta" && (
            <Button variant="ghost" size="sm" onClick={() => updateJobStatus("pausada")}>
              <Pause className="w-4 h-4" /> Pausar
            </Button>
          )}
          {job.status === "pausada" && (
            <Button variant="ghost" size="sm" onClick={() => updateJobStatus("aberta")}>
              <Play className="w-4 h-4" /> Reabrir
            </Button>
          )}
          {job.status !== "encerrada" && (
            <Button variant="danger" size="sm" onClick={() => updateJobStatus("encerrada")}>
              <XCircle className="w-4 h-4" /> Encerrar
            </Button>
          )}
        </div>

        {/* Info da vaga */}
        <Card>
          <div className="flex flex-wrap gap-4 text-sm text-gray">
            {(job.partner as any)?.company_name && (
              <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {(job.partner as any).company_name}</span>
            )}
            {job.city && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.city}, {job.state}</span>}
            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.contract_type} · {job.work_model}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {applications.length} candidatos</span>
            {job.salary_range && <span className="font-bold text-gold-dark">{job.salary_range}</span>}
          </div>
          {job.description && <p className="text-sm text-gray mt-3">{job.description}</p>}
        </Card>

        {/* Pipeline */}
        <div>
          <h2 className="font-bold text-navy mb-4">Pipeline de Candidatos</h2>

          {applications.length === 0 && (
            <Card className="text-center py-8">
              <p className="text-gray">Nenhum candidato inscrito nesta vaga ainda.</p>
            </Card>
          )}

          <div className="space-y-4">
            {stages.map((stage) => {
              const stageApps = applications.filter(a => a.stage === stage.key);
              if (stageApps.length === 0) return null;

              return (
                <div key={stage.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${stage.color} text-navy`}>
                      {stage.label}
                    </span>
                    <span className="text-xs text-gray">({stageApps.length})</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stageApps.map((app) => {
                      const profile = app.candidate?.profile;
                      const nextStage = getNextStage(app.stage);

                      return (
                        <Card key={app.id} padding="sm" className="relative">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">
                                {profile?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}
                              </div>
                              <div>
                                <p className="font-bold text-navy text-sm">{profile?.full_name || "Candidato"}</p>
                                <p className="text-xs text-gray">{profile?.email}</p>
                              </div>
                            </div>
                            {app.rating && (
                              <div className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 text-gold fill-gold" />
                                <span className="text-xs font-bold text-navy">{app.rating}</span>
                              </div>
                            )}
                          </div>

                          {app.candidate?.city && (
                            <p className="text-xs text-gray mb-2 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {app.candidate.city}{app.candidate.state ? `, ${app.candidate.state}` : ""}
                            </p>
                          )}

                          <div className="flex gap-2 mt-3 pt-3 border-t border-line">
                            {nextStage && (
                              <button
                                onClick={() => setNoteModal({ appId: app.id, action: "advance", nextStage })}
                                disabled={updating === app.id}
                                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-bold bg-navy/5 text-navy hover:bg-navy/10 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Avançar <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => setNoteModal({ appId: app.id, action: "reject" })}
                              disabled={updating === app.id}
                              className="px-2 py-1.5 rounded text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Reprovar
                            </button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de notas */}
      {noteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setNoteModal(null); setNote(""); }} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-navy text-lg mb-2">
              {noteModal.action === "advance" ? "Avançar candidato" : "Reprovar candidato"}
            </h3>
            <p className="text-sm text-gray mb-4">
              {noteModal.action === "advance"
                ? `Mover para: ${stages.find(s => s.key === noteModal.nextStage)?.label}`
                : "O candidato será removido do processo."}
            </p>
            <textarea
              placeholder="Observação (opcional)..."
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setNoteModal(null); setNote(""); }}
                className="px-4 py-2 rounded-lg text-sm font-bold text-gray hover:bg-soft transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              {noteModal.action === "advance" && noteModal.nextStage && (
                <button
                  onClick={() => moveCandidate(noteModal.appId, noteModal.nextStage!, note)}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-navy text-white hover:bg-navy-deep transition-colors cursor-pointer"
                >
                  Confirmar
                </button>
              )}
              {noteModal.action === "reject" && (
                <button
                  onClick={() => rejectCandidate(noteModal.appId, note)}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Reprovar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
