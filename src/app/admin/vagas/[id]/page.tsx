"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Edit, Pause, XCircle, Play, MapPin, Building2, Briefcase, Users, Loader2, Star, ChevronRight, Calendar, Copy, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Job } from "@/lib/types";

export default function VagaDetalhePage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [pipelineStages, setPipelineStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [noteModal, setNoteModal] = useState<{ appId: string; action: "advance" | "reject"; nextStage?: any } | null>(null);
  const [note, setNote] = useState("");
  const [duplicating, setDuplicating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { loadData(); }, [id]);

  async function loadData() {
    // Carregar vaga
    const { data: jobData } = await supabase
      .from("jobs")
      .select("*, partner:partners(company_name)")
      .eq("id", id)
      .single();
    if (jobData) setJob(jobData as Job);

    // Carregar pipeline configurado da vaga
    const { data: pipeline } = await supabase
      .from("job_pipeline")
      .select("*, stage:pipeline_stages(id, name, stage_type)")
      .eq("job_id", id)
      .order("position");

    if (pipeline && pipeline.length > 0) {
      setPipelineStages(pipeline.map(p => p.stage));
    } else {
      // Fallback: etapas padrão se não configurou pipeline
      const { data: defaultStages } = await supabase
        .from("pipeline_stages")
        .select("*")
        .in("name", ["Inscrição", "Triagem de currículo", "Entrevista RH", "Contratação"])
        .order("name");
      if (defaultStages) setPipelineStages(defaultStages);
    }

    // Carregar candidaturas
    const { data: apps } = await supabase
      .from("applications")
      .select(`
        *,
        candidate:candidates(
          id, city, state, salary_expectation,
          profile:profiles(full_name, email, phone)
        )
      `)
      .eq("job_id", id)
      .not("stage", "in", "(reprovado,desistente)")
      .order("applied_at", { ascending: false });

    if (apps) setApplications(apps);
    setLoading(false);
  }

  function getStageForApp(app: any): any {
    // Se tem current_stage_id, usar
    if (app.current_stage_id) {
      return pipelineStages.find(s => s.id === app.current_stage_id);
    }
    // Fallback: mapear stage enum antigo para pipeline stage
    const stageMap: Record<string, string> = {
      inscrito: "Inscrição",
      triagem: "Triagem de currículo",
      entrevista_rh: "Entrevista RH",
      entrevista_cliente: "Entrevista com Gestor",
      teste_tecnico: "Teste técnico",
      aprovado: "Proposta salarial",
      contratado: "Contratação",
    };
    const stageName = stageMap[app.stage] || "Inscrição";
    return pipelineStages.find(s => s.name === stageName) || pipelineStages[0];
  }

  function getNextStage(currentStage: any): any | null {
    const idx = pipelineStages.findIndex(s => s.id === currentStage?.id);
    if (idx >= 0 && idx < pipelineStages.length - 1) return pipelineStages[idx + 1];
    return null;
  }

  async function moveCandidate(applicationId: string, nextStage: any, description?: string) {
    setUpdating(applicationId);

    // Atualizar current_stage_id e stage legado
    const legacyStageMap: Record<string, string> = {
      triagem: "triagem", teste: "teste_tecnico", entrevista: "entrevista_rh",
      proposta: "aprovado", contratacao: "contratado",
    };

    await supabase.from("applications").update({
      current_stage_id: nextStage.id,
      stage: legacyStageMap[nextStage.stage_type] || "triagem",
    }).eq("id", applicationId);

    // Timeline
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("application_timeline").insert({
      application_id: applicationId,
      stage: legacyStageMap[nextStage.stage_type] || "triagem",
      title: `Avançou para: ${nextStage.name}`,
      description: description || null,
      created_by: user?.id,
    });

    // Notificação por e-mail
    fetch("/api/notifications/stage-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, newStage: nextStage.name, note: description }),
    }).catch(() => {});

    // Se é etapa de entrevista, criar agendamento automaticamente
    if (nextStage.stage_type === "entrevista") {
      await supabase.from("interviews").insert({
        application_id: applicationId,
        interview_type: nextStage.name,
        scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 dias placeholder
        duration_minutes: 60,
      });
    }

    // Atualizar UI
    setApplications(apps =>
      apps.map(a => a.id === applicationId ? { ...a, current_stage_id: nextStage.id } : a)
    );
    setUpdating(null);
    setNoteModal(null);
    setNote("");
  }

  async function rejectCandidate(applicationId: string, description?: string) {
    setUpdating(applicationId);
    await supabase.from("applications").update({ stage: "reprovado" }).eq("id", applicationId);

    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("application_timeline").insert({
      application_id: applicationId, stage: "reprovado",
      title: "Reprovado no processo", description: description || null, created_by: user?.id,
    });

    fetch("/api/notifications/stage-change", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, newStage: "reprovado", note: description }),
    }).catch(() => {});

    setApplications(apps => apps.filter(a => a.id !== applicationId));
    setUpdating(null); setNoteModal(null); setNote("");
  }

  async function duplicateJob() {
    if (!job) return;
    setDuplicating(true);
    try {
      const { data: newJob, error } = await supabase
        .from("jobs")
        .insert({
          title: `Cópia de ${job.title}`,
          description: job.description,
          requirements: job.requirements,
          benefits: job.benefits,
          salary_range: job.salary_range,
          city: job.city,
          state: job.state,
          work_model: job.work_model,
          contract_type: job.contract_type,
          positions_count: job.positions_count,
          partner_id: job.partner_id,
          deadline: job.deadline,
          status: "aberta",
          created_by: job.created_by,
        })
        .select("id")
        .single();

      if (error || !newJob) throw error;

      // Copy pipeline stages
      const { data: pipeline } = await supabase
        .from("job_pipeline")
        .select("stage_id, position")
        .eq("job_id", id);

      if (pipeline && pipeline.length > 0) {
        await supabase.from("job_pipeline").insert(
          pipeline.map((p: any) => ({ job_id: newJob.id, stage_id: p.stage_id, position: p.position }))
        );
      }

      router.push(`/admin/vagas/${newJob.id}`);
    } catch (err) {
      alert("Erro ao duplicar vaga.");
      setDuplicating(false);
    }
  }

  async function deleteJob() {
    if (!confirm("Tem certeza que deseja excluir esta vaga? Esta ação não pode ser desfeita.")) return;
    setDeleting(true);
    try {
      await supabase.from("job_pipeline").delete().eq("job_id", id);
      await supabase.from("jobs").delete().eq("id", id);
      router.push("/admin/vagas");
    } catch (err) {
      alert("Erro ao excluir vaga.");
      setDeleting(false);
    }
  }

  async function updateJobStatus(status: "aberta" | "pausada" | "encerrada") {
    await supabase.from("jobs").update({ status }).eq("id", id);
    setJob(prev => prev ? { ...prev, status } : null);
  }

  if (loading) {
    return (<><DashboardHeader title="Carregando..." subtitle="" /><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div></>);
  }

  if (!job) {
    return (<><DashboardHeader title="Vaga não encontrada" subtitle="" /><div className="p-6"><Link href="/admin/vagas"><Button variant="ghost"><ArrowLeft className="w-4 h-4" /> Voltar</Button></Link></div></>);
  }

  const stageTypeColors: Record<string, string> = {
    triagem: "bg-gray/10", teste: "bg-navy/10", entrevista: "bg-gold/10",
    proposta: "bg-green/10", contratacao: "bg-green/20", outro: "bg-soft",
  };

  return (
    <>
      <DashboardHeader title={job.title} subtitle={`${(job.partner as any)?.company_name || "Sem empresa"} · ${job.city || ""}`} />

      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/vagas"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> Voltar</Button></Link>
          <Link href={`/admin/vagas/${id}/editar`}><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /> Editar</Button></Link>
          <Button variant="ghost" size="sm" onClick={duplicateJob} disabled={duplicating}><Copy className="w-4 h-4" /> {duplicating ? "Duplicando..." : "Duplicar"}</Button>
          <Button variant="danger" size="sm" onClick={deleteJob} disabled={deleting}><Trash2 className="w-4 h-4" /> {deleting ? "Excluindo..." : "Excluir"}</Button>
          <div className="flex-1" />
          {job.status === "aberta" && <Button variant="ghost" size="sm" onClick={() => updateJobStatus("pausada")}><Pause className="w-4 h-4" /> Pausar</Button>}
          {job.status === "pausada" && <Button variant="ghost" size="sm" onClick={() => updateJobStatus("aberta")}><Play className="w-4 h-4" /> Reabrir</Button>}
          {job.status !== "encerrada" && <Button variant="danger" size="sm" onClick={() => updateJobStatus("encerrada")}><XCircle className="w-4 h-4" /> Encerrar</Button>}
        </div>

        {/* Info */}
        <Card>
          <div className="flex flex-wrap gap-4 text-sm text-gray">
            {(job.partner as any)?.company_name && <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {(job.partner as any).company_name}</span>}
            {job.city && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.city}, {job.state}</span>}
            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.contract_type} · {job.work_model}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {applications.length} candidatos</span>
            {job.salary_range && <span className="font-bold text-gold-dark">{job.salary_range}</span>}
          </div>
          {job.description && <p className="text-sm text-gray mt-3">{job.description}</p>}
        </Card>

        {/* Pipeline visual (indicador de etapas) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {pipelineStages.map((stage, i) => {
            const count = applications.filter(a => getStageForApp(a)?.id === stage.id).length;
            return (
              <div key={stage.id} className="flex items-center">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${stageTypeColors[stage.stage_type]} text-navy`}>
                  {stage.name} {count > 0 && <span className="ml-1 text-gold-dark">({count})</span>}
                </div>
                {i < pipelineStages.length - 1 && <ChevronRight className="w-4 h-4 text-gray/30 shrink-0 mx-0.5" />}
              </div>
            );
          })}
        </div>

        {/* Pipeline / Kanban */}
        <div>
          <h2 className="font-bold text-navy mb-4">Pipeline de Candidatos</h2>

          {applications.length === 0 && (
            <Card className="text-center py-8"><p className="text-gray">Nenhum candidato inscrito nesta vaga.</p></Card>
          )}

          <div className="space-y-4">
            {pipelineStages.map((stage) => {
              const stageApps = applications.filter(a => getStageForApp(a)?.id === stage.id);
              if (stageApps.length === 0) return null;

              return (
                <div key={stage.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${stageTypeColors[stage.stage_type]} text-navy`}>
                      {stage.stage_type === "entrevista" && <Calendar className="w-3 h-3" />}
                      {stage.name}
                    </span>
                    <span className="text-xs text-gray">({stageApps.length})</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stageApps.map((app) => {
                      const profile = app.candidate?.profile;
                      const nextStage = getNextStage(getStageForApp(app));

                      return (
                        <Card key={app.id} padding="sm" className="relative">
                          <div className="flex items-start justify-between mb-2">
                            <Link href={`/admin/vagas/${id}/candidato/${app.id}`} className="flex items-center gap-2 hover:text-gold-dark">
                              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">
                                {profile?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}
                              </div>
                              <div>
                                <p className="font-bold text-navy text-sm">{profile?.full_name || "Candidato"}</p>
                                <p className="text-xs text-gray">{profile?.email}</p>
                              </div>
                            </Link>
                          </div>

                          {app.candidate?.city && (
                            <p className="text-xs text-gray mb-2 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {app.candidate.city}
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
                ? `Mover para: ${noteModal.nextStage?.name}`
                : "O candidato será removido do processo."}
            </p>
            {noteModal.action === "advance" && noteModal.nextStage?.stage_type === "entrevista" && (
              <p className="text-xs text-gold-dark bg-gold/10 p-2 rounded mb-3">
                📅 Uma entrevista será criada automaticamente ao avançar para esta etapa.
              </p>
            )}
            <textarea placeholder="Observação (opcional)..." rows={3} value={note} onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setNoteModal(null); setNote(""); }}
                className="px-4 py-2 rounded-lg text-sm font-bold text-gray hover:bg-soft transition-colors cursor-pointer">Cancelar</button>
              {noteModal.action === "advance" && (
                <button onClick={() => moveCandidate(noteModal.appId, noteModal.nextStage!, note)}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-navy text-white hover:bg-navy-deep transition-colors cursor-pointer">Confirmar</button>
              )}
              {noteModal.action === "reject" && (
                <button onClick={() => rejectCandidate(noteModal.appId, note)}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer">Reprovar</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
