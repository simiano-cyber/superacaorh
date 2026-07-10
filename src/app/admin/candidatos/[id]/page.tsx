"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, MapPin, Mail, Phone, Link2, Globe, Briefcase, GraduationCap, Loader2, FileText, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CandidatoDetalhePage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [candidate, setCandidate] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [savingComment, setSavingComment] = useState(false);

  useEffect(() => { loadData(); }, [id]);

  async function loadData() {
    const { data } = await supabase
      .from("candidates")
      .select(`
        *,
        profile:profiles(full_name, email, phone),
        experiences:candidate_experiences(*),
        education:candidate_education(*),
        skills:candidate_skills(*)
      `)
      .eq("id", id)
      .single();

    if (data) setCandidate(data);

    // Candidaturas
    const { data: apps } = await supabase
      .from("applications")
      .select("*, job:jobs(title, status)")
      .eq("candidate_id", id)
      .order("applied_at", { ascending: false });
    if (apps) setApplications(apps);

    // Tags do candidato
    const tagsRes = await fetch(`/api/admin/tags?candidateId=${id}`);
    const candidateTags = await tagsRes.json();
    if (Array.isArray(candidateTags)) setTags(candidateTags);

    // Todas as tags
    const allTagsRes = await fetch("/api/admin/tags");
    const at = await allTagsRes.json();
    if (Array.isArray(at)) setAllTags(at);

    // Comentários
    const commsRes = await fetch(`/api/admin/comments?candidateId=${id}`);
    const comms = await commsRes.json();
    if (Array.isArray(comms)) setComments(comms);

    setLoading(false);
  }

  async function addTag(tagId: string) {
    await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidate_id: id, tag_id: tagId }),
    });
    loadData();
  }

  async function removeTag(candidateTagId: string) {
    await fetch(`/api/admin/tags?id=${candidateTagId}`, { method: "DELETE" });
    setTags(tags.filter(t => t.id !== candidateTagId));
  }

  async function addComment() {
    if (!newComment.trim()) return;
    setSavingComment(true);
    await fetch("/api/admin/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidate_id: id, content: newComment.trim() }),
    });
    setNewComment("");
    setSavingComment(false);
    loadData();
  }

  async function deleteCandidate() {
    if (!confirm("Tem certeza que deseja excluir este candidato? Todos os dados serão removidos permanentemente.")) return;
    try {
      // Delete related data
      await supabase.from("candidate_tags").delete().eq("candidate_id", id);
      await supabase.from("internal_comments").delete().eq("candidate_id", id);
      await supabase.from("applications").delete().eq("candidate_id", id);
      await supabase.from("candidate_experiences").delete().eq("candidate_id", id);
      await supabase.from("candidate_education").delete().eq("candidate_id", id);
      await supabase.from("candidate_skills").delete().eq("candidate_id", id);
      const profileId = candidate?.profile_id;
      await supabase.from("candidates").delete().eq("id", id);
      if (profileId) {
        await supabase.from("profiles").delete().eq("id", profileId);
      }
      router.push("/admin/candidatos");
    } catch (err) {
      alert("Erro ao excluir candidato.");
    }
  }

  if (loading) {
    return (<><DashboardHeader title="Carregando..." subtitle="" /><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div></>);
  }

  if (!candidate) {
    return (<><DashboardHeader title="Candidato não encontrado" subtitle="" /><div className="p-6"><Link href="/admin/candidatos"><Button variant="ghost"><ArrowLeft className="w-4 h-4" /> Voltar</Button></Link></div></>);
  }

  const profile = candidate.profile;
  const stageLabels: Record<string, string> = {
    inscrito: "Inscrito", triagem: "Triagem", entrevista_rh: "Entrevista RH",
    entrevista_cliente: "Entrevista Cliente", teste_tecnico: "Teste Técnico",
    aprovado: "Aprovado", contratado: "Contratado", reprovado: "Reprovado",
  };

  return (
    <>
      <DashboardHeader title={profile?.full_name || "Candidato"} subtitle={profile?.email || ""} />

      <div className="p-6 space-y-6 max-w-5xl">
        <Link href="/admin/candidatos">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> Voltar</Button>
        </Link>

        <div className="flex items-center gap-3">
          <Link href={`/admin/candidatos/${id}/editar`}>
            <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /> Editar</Button>
          </Link>
        </div>

        {/* Info principal */}
        <Card>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center text-white font-bold text-xl shrink-0">
              {profile?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-xl font-bold text-navy">{profile?.full_name}</h2>
              {candidate.objective && <p className="text-sm text-gray">{candidate.objective}</p>}
              <div className="flex flex-wrap gap-4 text-sm text-gray">
                {profile?.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {profile.email}</span>}
                {profile?.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {profile.phone}</span>}
                {candidate.city && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {candidate.city}{candidate.state ? `, ${candidate.state}` : ""}</span>}
                {candidate.linkedin_url && <a href={candidate.linkedin_url} target="_blank" className="flex items-center gap-1 text-navy hover:text-gold-dark"><Link2 className="w-4 h-4" /> LinkedIn</a>}
                {candidate.portfolio_url && <a href={candidate.portfolio_url} target="_blank" className="flex items-center gap-1 text-navy hover:text-gold-dark"><Globe className="w-4 h-4" /> Portfólio</a>}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                {candidate.salary_expectation && <span className="text-gold-dark font-bold">Pretensão: R$ {Number(candidate.salary_expectation).toLocaleString("pt-BR")}</span>}
                {candidate.availability && <span className="text-gray">Disponibilidade: {candidate.availability}</span>}
              </div>
              {candidate.resume_url && (
                <a href={candidate.resume_url} target="_blank" className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-gold-dark">
                  <FileText className="w-4 h-4" /> Ver CV em PDF
                </a>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Experiências */}
          <Card>
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5" /> Experiência</h3>
            {candidate.experiences?.length === 0 && <p className="text-sm text-gray">Nenhuma experiência cadastrada.</p>}
            <div className="space-y-4">
              {candidate.experiences?.map((exp: any) => (
                <div key={exp.id} className="border-l-2 border-gold pl-4">
                  <p className="font-bold text-navy text-sm">{exp.position}</p>
                  <p className="text-xs text-gray">{exp.company} · {exp.start_date} - {exp.end_date || "Atual"}</p>
                  {exp.description && <p className="text-sm text-gray mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          </Card>

          {/* Formação */}
          <Card>
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Formação</h3>
            {candidate.education?.length === 0 && <p className="text-sm text-gray">Nenhuma formação cadastrada.</p>}
            <div className="space-y-4">
              {candidate.education?.map((edu: any) => (
                <div key={edu.id} className="border-l-2 border-navy pl-4">
                  <p className="font-bold text-navy text-sm">{edu.course}</p>
                  <p className="text-xs text-gray">{edu.institution} · {edu.degree}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Habilidades */}
        {candidate.skills?.length > 0 && (
          <Card>
            <h3 className="font-bold text-navy mb-3">Habilidades</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((s: any) => (
                <span key={s.id} className="px-3 py-1.5 bg-soft rounded-lg text-sm font-medium text-navy">{s.skill_name}</span>
              ))}
            </div>
          </Card>
        )}

        {/* Candidaturas */}
        <Card>
          <h3 className="font-bold text-navy mb-4">Processos Seletivos</h3>
          {applications.length === 0 && <p className="text-sm text-gray">Nenhuma candidatura.</p>}
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between py-3 border-b border-line last:border-0">
                <div>
                  <p className="font-semibold text-navy text-sm">{app.job?.title}</p>
                  <p className="text-xs text-gray">{new Date(app.applied_at).toLocaleDateString("pt-BR")}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gold/10 text-gold-dark">
                  {stageLabels[app.stage] || app.stage}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tags */}
        <Card>
          <h3 className="font-bold text-navy mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((ct) => (
              <span key={ct.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: ct.tag?.color || "#142033" }}>
                {ct.tag?.name}
                <button onClick={() => removeTag(ct.id)} className="hover:opacity-70 cursor-pointer">×</button>
              </span>
            ))}
          </div>
          <select
            onChange={(e) => { if (e.target.value) { addTag(e.target.value); e.target.value = ""; } }}
            className="h-9 px-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          >
            <option value="">+ Adicionar tag...</option>
            {allTags.filter(t => !tags.some(ct => ct.tag_id === t.id)).map((tag) => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </Card>

        {/* Comentários internos */}
        <Card>
          <h3 className="font-bold text-navy mb-3">Comentários internos</h3>
          <p className="text-xs text-gray mb-4">Visíveis apenas para a equipe SuperAção RH.</p>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Adicionar comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
              className="flex-1 h-10 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
            <button
              onClick={addComment}
              disabled={savingComment || !newComment.trim()}
              className="h-10 px-4 rounded-lg bg-navy text-white text-sm font-bold hover:bg-navy-deep transition-colors cursor-pointer disabled:opacity-50"
            >
              Enviar
            </button>
          </div>

          {comments.length === 0 && <p className="text-sm text-gray">Nenhum comentário ainda.</p>}
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

        {/* Zona de perigo */}
        <Card>
          <h3 className="font-bold text-red-600 mb-2 flex items-center gap-2"><Trash2 className="w-5 h-5" /> Zona de perigo</h3>
          <p className="text-sm text-gray mb-4">Ações irreversíveis. Prossiga com cuidado.</p>
          <Button variant="danger" size="sm" onClick={deleteCandidate}>
            <Trash2 className="w-4 h-4" /> Excluir candidato
          </Button>
        </Card>
      </div>
    </>
  );
}
