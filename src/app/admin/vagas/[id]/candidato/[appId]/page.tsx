"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Loader2, Clock, MessageSquare, Calendar, CheckCircle, XCircle, ChevronRight, User } from "lucide-react";
import Link from "next/link";

export default function CandidatoVagaTimelinePage() {
  const { id: jobId, appId } = useParams();
  const supabase = createClient();
  const [application, setApplication] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [savingComment, setSavingComment] = useState(false);

  useEffect(() => { loadData(); }, [appId]);

  async function loadData() {
    // Candidatura com dados
    const { data: app } = await supabase
      .from("applications")
      .select(`
        *,
        candidate:candidates(id, city, state, profile:profiles(full_name, email, phone)),
        job:jobs(title)
      `)
      .eq("id", appId)
      .single();
    if (app) setApplication(app);

    // Timeline
    const { data: tl } = await supabase
      .from("application_timeline")
      .select("*, author:profiles(full_name)")
      .eq("application_id", appId)
      .order("created_at", { ascending: false });
    if (tl) setTimeline(tl);

    // Entrevistas
    const { data: intv } = await supabase
      .from("interviews")
      .select("*")
      .eq("application_id", appId)
      .order("scheduled_at", { ascending: false });
    if (intv) setInterviews(intv);

    // Comentários internos
    const { data: comms } = await supabase
      .from("internal_comments")
      .select("*, author:profiles(full_name)")
      .eq("application_id", appId)
      .order("created_at", { ascending: false });
    if (comms) setComments(comms);

    setLoading(false);
  }

  async function addComment() {
    if (!newComment.trim()) return;
    setSavingComment(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("internal_comments").insert({
      application_id: appId,
      candidate_id: application?.candidate?.id,
      author_id: user?.id,
      content: newComment.trim(),
    });
    setNewComment("");
    setSavingComment(false);
    loadData();
  }

  if (loading) {
    return (<><DashboardHeader title="Carregando..." subtitle="" /><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div></>);
  }

  if (!application) {
    return (<><DashboardHeader title="Não encontrado" subtitle="" /><div className="p-6"><Link href={`/admin/vagas/${jobId}`}><Button variant="ghost"><ArrowLeft className="w-4 h-4" /> Voltar</Button></Link></div></>);
  }

  const profile = application.candidate?.profile;
  const stageLabels: Record<string, string> = {
    inscrito: "Inscrito", triagem: "Triagem", entrevista_rh: "Entrevista RH",
    entrevista_cliente: "Entrevista Cliente", teste_tecnico: "Teste Técnico",
    aprovado: "Aprovado", contratado: "Contratado", reprovado: "Reprovado",
  };

  return (
    <>
      <DashboardHeader title={`${profile?.full_name || "Candidato"}`} subtitle={`${application.job?.title} — ${stageLabels[application.stage] || application.stage}`} />

      <div className="p-6 space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href={`/admin/vagas/${jobId}`}>
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> Voltar ao pipeline</Button>
          </Link>
          <Link href={`/admin/candidatos/${application.candidate?.id}`}>
            <Button variant="ghost" size="sm"><User className="w-4 h-4" /> Ver perfil completo</Button>
          </Link>
        </div>

        {/* Info resumida */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-white font-bold">
              {profile?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h2 className="font-bold text-navy text-lg">{profile?.full_name}</h2>
              <p className="text-sm text-gray">{profile?.email} {profile?.phone ? `· ${profile.phone}` : ""}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${application.stage === "aprovado" || application.stage === "contratado" ? "bg-green/10 text-green" : application.stage === "reprovado" ? "bg-red-100 text-red-600" : "bg-gold/10 text-gold-dark"}`}>
                  {stageLabels[application.stage]}
                </span>
                <span className="text-xs text-gray">Candidatura em {new Date(application.applied_at).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <Card>
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Clock className="w-5 h-5" /> Linha do Tempo</h3>
            {timeline.length === 0 && <p className="text-sm text-gray">Nenhuma movimentação registrada.</p>}
            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.stage === "reprovado" ? "bg-red-100" : item.stage === "contratado" || item.stage === "aprovado" ? "bg-green/10" : "bg-gold/10"}`}>
                      {item.stage === "reprovado" ? <XCircle className="w-4 h-4 text-red-600" /> :
                       item.stage === "aprovado" || item.stage === "contratado" ? <CheckCircle className="w-4 h-4 text-green" /> :
                       <ChevronRight className="w-4 h-4 text-gold-dark" />}
                    </div>
                    <div className="w-px flex-1 bg-line mt-1" />
                  </div>
                  <div className="pb-4">
                    <p className="font-bold text-navy text-sm">{item.title}</p>
                    {item.description && <p className="text-sm text-gray mt-1">{item.description}</p>}
                    <p className="text-xs text-gray mt-1">
                      {item.author?.full_name || "Sistema"} · {new Date(item.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Entrevistas */}
          <Card>
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" /> Entrevistas</h3>
            {interviews.length === 0 && <p className="text-sm text-gray">Nenhuma entrevista registrada.</p>}
            <div className="space-y-3">
              {interviews.map((intv) => (
                <div key={intv.id} className="p-3 border border-line rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-navy">{intv.interview_type || "Entrevista"}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${intv.result === "aprovado" ? "bg-green/10 text-green" : intv.result === "reprovado" ? "bg-red-100 text-red-600" : "bg-gold/10 text-gold-dark"}`}>
                      {intv.result || "Pendente"}
                    </span>
                  </div>
                  <div className="text-xs text-gray space-y-1">
                    {intv.scheduled_at && <p>📅 {new Date(intv.scheduled_at).toLocaleString("pt-BR")}</p>}
                    {intv.location && <p>📍 {intv.location}</p>}
                    {intv.interviewer_name && <p>👤 {intv.interviewer_name}</p>}
                  </div>
                  {intv.feedback && (
                    <div className="mt-2 pt-2 border-t border-line">
                      <p className="text-xs font-bold text-navy">Feedback:</p>
                      <p className="text-sm text-gray">{intv.feedback}</p>
                    </div>
                  )}
                  {intv.notes && (
                    <div className="mt-2 pt-2 border-t border-line">
                      <p className="text-xs font-bold text-navy">Notas:</p>
                      <p className="text-sm text-gray">{intv.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Comentários */}
        <Card>
          <h3 className="font-bold text-navy mb-3 flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Comentários do processo</h3>
          <p className="text-xs text-gray mb-4">Notas internas sobre este candidato nesta vaga.</p>

          <div className="flex gap-2 mb-4">
            <input type="text" placeholder="Adicionar comentário..." value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
              className="flex-1 h-10 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
            <button onClick={addComment} disabled={savingComment || !newComment.trim()}
              className="h-10 px-4 rounded-lg bg-navy text-white text-sm font-bold hover:bg-navy-deep transition-colors cursor-pointer disabled:opacity-50">
              Enviar
            </button>
          </div>

          {comments.length === 0 && <p className="text-sm text-gray">Nenhum comentário.</p>}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="p-3 bg-soft rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-navy">{comment.author?.full_name || "Equipe"}</span>
                  <span className="text-xs text-gray">{new Date(comment.created_at).toLocaleString("pt-BR")}</span>
                </div>
                <p className="text-sm text-gray">{comment.content}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
