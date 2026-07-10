"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Save, Plus, Trash2, Loader2, Upload, X } from "lucide-react";
import { ESTADOS_BR, DISPONIBILIDADE_OPTIONS, maskPhone, maskCurrency, unmaskCurrency, unmaskPhone } from "@/lib/constants";

export default function CurriculoPage() {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Dados pessoais
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [objective, setObjective] = useState("");
  const [salary, setSalary] = useState("");
  const [availability, setAvailability] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  // Experiências, formação, habilidades
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Modais
  const [showExpForm, setShowExpForm] = useState(false);
  const [showEduForm, setShowEduForm] = useState(false);
  const [expForm, setExpForm] = useState({ company: "", position: "", start_date: "", end_date: "", description: "" });
  const [eduForm, setEduForm] = useState({ institution: "", course: "", degree: "", start_date: "", end_date: "" });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    let { data: candidate } = await supabase
      .from("candidates").select("*").eq("profile_id", user.id).single();

    if (!candidate) {
      const { data: nc } = await supabase
        .from("candidates").insert({ profile_id: user.id }).select().single();
      candidate = nc;
    }

    if (candidate) {
      setCandidateId(candidate.id);
      setCity(candidate.city || "");
      setState(candidate.state || "");
      setLinkedin(candidate.linkedin_url || "");
      setPortfolio(candidate.portfolio_url || "");
      setObjective(candidate.objective || "");
      setSalary(candidate.salary_expectation ? maskCurrency(String(Math.round(candidate.salary_expectation * 100))) : "");
      setAvailability(candidate.availability || "");
      setResumeUrl(candidate.resume_url || "");

      const { data: exps } = await supabase.from("candidate_experiences")
        .select("*").eq("candidate_id", candidate.id).order("start_date", { ascending: false });
      if (exps) setExperiences(exps);

      const { data: edus } = await supabase.from("candidate_education")
        .select("*").eq("candidate_id", candidate.id).order("start_date", { ascending: false });
      if (edus) setEducation(edus);

      const { data: sks } = await supabase.from("candidate_skills")
        .select("*").eq("candidate_id", candidate.id);
      if (sks) setSkills(sks);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!candidateId) return;
    setSaving(true); setMessage("");
    const { error } = await supabase.from("candidates").update({
      city: city || null, state: state || null,
      linkedin_url: linkedin || null, portfolio_url: portfolio || null,
      objective: objective || null,
      salary_expectation: salary ? unmaskCurrency(salary) : null,
      availability: availability || null,
    }).eq("id", candidateId);

    setMessage(error ? "Erro ao salvar." : "Currículo salvo!");
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId || !candidateId) return;

    const ext = file.name.split(".").pop();
    const path = `resumes/${userId}/cv.${ext}`;

    const { error: uploadError } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
    if (uploadError) { setMessage("Erro no upload: " + uploadError.message); return; }

    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
    const url = urlData.publicUrl;

    await supabase.from("candidates").update({ resume_url: url }).eq("id", candidateId);
    setResumeUrl(url);
    setMessage("CV enviado com sucesso!");
    setTimeout(() => setMessage(""), 3000);
  }

  async function addExperience(e: React.FormEvent) {
    e.preventDefault();
    if (!candidateId) return;
    const { data } = await supabase.from("candidate_experiences")
      .insert({ candidate_id: candidateId, ...expForm, end_date: expForm.end_date || null }).select().single();
    if (data) { setExperiences([data, ...experiences]); setShowExpForm(false); setExpForm({ company: "", position: "", start_date: "", end_date: "", description: "" }); }
  }

  async function removeExperience(id: string) {
    await supabase.from("candidate_experiences").delete().eq("id", id);
    setExperiences(experiences.filter(e => e.id !== id));
  }

  async function addEducation(e: React.FormEvent) {
    e.preventDefault();
    if (!candidateId) return;
    const { data } = await supabase.from("candidate_education")
      .insert({ candidate_id: candidateId, ...eduForm, end_date: eduForm.end_date || null }).select().single();
    if (data) { setEducation([data, ...education]); setShowEduForm(false); setEduForm({ institution: "", course: "", degree: "", start_date: "", end_date: "" }); }
  }

  async function removeEducation(id: string) {
    await supabase.from("candidate_education").delete().eq("id", id);
    setEducation(education.filter(e => e.id !== id));
  }

  async function addSkill() {
    if (!newSkill.trim() || !candidateId) return;
    const { data } = await supabase.from("candidate_skills")
      .insert({ candidate_id: candidateId, skill_name: newSkill.trim() }).select().single();
    if (data) { setSkills([...skills, data]); setNewSkill(""); }
  }

  async function removeSkill(id: string) {
    await supabase.from("candidate_skills").delete().eq("id", id);
    setSkills(skills.filter(s => s.id !== id));
  }

  if (loading) {
    return (<><DashboardHeader title="Meu Currículo" subtitle="Carregando..." /><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div></>);
  }

  return (
    <>
      <DashboardHeader title="Meu Currículo" subtitle="Mantenha seus dados atualizados" />
      <div className="p-6 space-y-6 max-w-4xl">

        {/* Dados pessoais */}
        <Card>
          <h2 className="font-bold text-navy mb-4">Dados Pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-navy mb-1.5">Estado</label>
              <select value={state} onChange={(e) => { setState(e.target.value); setCity(""); }}
                className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                <option value="">Selecione o estado</option>
                {ESTADOS_BR.map(e => <option key={e.uf} value={e.uf}>{e.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-1.5">Cidade</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Digite a cidade"
                className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <Input id="linkedin" label="LinkedIn" placeholder="https://linkedin.com/in/seu-perfil" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            <Input id="portfolio" label="Portfólio / Site" placeholder="https://seusite.com" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
          </div>
          <div className="mt-4">
            <label className="text-sm font-bold text-navy block mb-1.5">Objetivo profissional</label>
            <textarea rows={3} value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="Descreva brevemente seu objetivo profissional..."
              className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-bold text-navy mb-1.5">Pretensão salarial mensal</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray">R$</span>
                <input type="text" value={salary} onChange={(e) => setSalary(maskCurrency(e.target.value))} placeholder="0,00"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-1.5">Disponibilidade</label>
              <select value={availability} onChange={(e) => setAvailability(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                <option value="">Selecione</option>
                {DISPONIBILIDADE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </Card>

        {/* Experiências */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy">Experiência Profissional</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowExpForm(true)}><Plus className="w-4 h-4" /> Adicionar</Button>
          </div>
          {showExpForm && (
            <form onSubmit={addExperience} className="p-4 border border-gold/30 rounded-lg mb-4 space-y-3">
              <div className="flex justify-between"><span className="font-bold text-navy text-sm">Nova experiência</span><button type="button" onClick={() => setShowExpForm(false)} className="cursor-pointer"><X className="w-4 h-4 text-gray" /></button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input id="expCompany" label="Empresa *" value={expForm.company} onChange={(e) => setExpForm({...expForm, company: e.target.value})} required />
                <Input id="expPosition" label="Cargo *" value={expForm.position} onChange={(e) => setExpForm({...expForm, position: e.target.value})} required />
                <Input id="expStart" label="Início *" type="date" value={expForm.start_date} onChange={(e) => setExpForm({...expForm, start_date: e.target.value})} required />
                <Input id="expEnd" label="Fim (vazio = atual)" type="date" value={expForm.end_date} onChange={(e) => setExpForm({...expForm, end_date: e.target.value})} />
              </div>
              <textarea placeholder="Descrição das atividades..." rows={2} value={expForm.description} onChange={(e) => setExpForm({...expForm, description: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical" />
              <Button type="submit" size="sm">Salvar experiência</Button>
            </form>
          )}
          {experiences.length === 0 && !showExpForm && <p className="text-sm text-gray">Nenhuma experiência cadastrada.</p>}
          {experiences.map((exp) => (
            <div key={exp.id} className="p-4 border border-line rounded-lg mb-3 flex justify-between items-start">
              <div>
                <p className="font-bold text-navy text-sm">{exp.position}</p>
                <p className="text-xs text-gray">{exp.company} · {exp.start_date} - {exp.end_date || "Atual"}</p>
                {exp.description && <p className="text-sm text-gray mt-1">{exp.description}</p>}
              </div>
              <button onClick={() => removeExperience(exp.id)} className="text-gray hover:text-red-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </Card>

        {/* Formação */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy">Formação Acadêmica</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowEduForm(true)}><Plus className="w-4 h-4" /> Adicionar</Button>
          </div>
          {showEduForm && (
            <form onSubmit={addEducation} className="p-4 border border-gold/30 rounded-lg mb-4 space-y-3">
              <div className="flex justify-between"><span className="font-bold text-navy text-sm">Nova formação</span><button type="button" onClick={() => setShowEduForm(false)} className="cursor-pointer"><X className="w-4 h-4 text-gray" /></button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input id="eduInst" label="Instituição *" value={eduForm.institution} onChange={(e) => setEduForm({...eduForm, institution: e.target.value})} required />
                <Input id="eduCourse" label="Curso *" value={eduForm.course} onChange={(e) => setEduForm({...eduForm, course: e.target.value})} required />
                <Input id="eduDegree" label="Nível" placeholder="Graduação, Pós, Técnico..." value={eduForm.degree} onChange={(e) => setEduForm({...eduForm, degree: e.target.value})} />
                <Input id="eduStart" label="Início" type="date" value={eduForm.start_date} onChange={(e) => setEduForm({...eduForm, start_date: e.target.value})} />
              </div>
              <Button type="submit" size="sm">Salvar formação</Button>
            </form>
          )}
          {education.length === 0 && !showEduForm && <p className="text-sm text-gray">Nenhuma formação cadastrada.</p>}
          {education.map((edu) => (
            <div key={edu.id} className="p-4 border border-line rounded-lg mb-3 flex justify-between items-start">
              <div>
                <p className="font-bold text-navy text-sm">{edu.course}</p>
                <p className="text-xs text-gray">{edu.institution} · {edu.degree || ""}</p>
              </div>
              <button onClick={() => removeEducation(edu.id)} className="text-gray hover:text-red-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </Card>

        {/* Habilidades */}
        <Card>
          <h2 className="font-bold text-navy mb-4">Habilidades</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
              <span key={skill.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-soft rounded-lg text-sm font-medium text-navy">
                {skill.skill_name}
                <button onClick={() => removeSkill(skill.id)} className="text-gray hover:text-red-500 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Nova habilidade..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              className="flex-1 h-10 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
            <Button type="button" size="sm" variant="ghost" onClick={addSkill}><Plus className="w-4 h-4" /> Adicionar</Button>
          </div>
        </Card>

        {/* Upload CV */}
        <Card>
          <h2 className="font-bold text-navy mb-4">Currículo em PDF</h2>
          {resumeUrl && (
            <p className="text-sm text-green mb-3">✓ CV enviado. <a href={resumeUrl} target="_blank" className="underline hover:text-navy">Ver arquivo</a></p>
          )}
          <div className="border-2 border-dashed border-line rounded-lg p-8 text-center">
            <p className="text-sm text-gray mb-3">Arraste ou clique para enviar seu CV</p>
            <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload className="w-4 h-4" /> Selecionar arquivo
            </Button>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
            <p className="text-xs text-gray mt-2">PDF, máximo 5MB</p>
          </div>
        </Card>

        {/* Mensagem e salvar */}
        {message && (
          <p className={`text-sm p-3 rounded-lg ${message.includes("Erro") ? "bg-red-50 text-red-600" : "bg-green/10 text-green"}`}>{message}</p>
        )}
        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving}><Save className="w-4 h-4" /> Salvar currículo</Button>
        </div>
      </div>
    </>
  );
}
