"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";

export default function CurriculoPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Dados pessoais
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [objective, setObjective] = useState("");
  const [salary, setSalary] = useState("");
  const [availability, setAvailability] = useState("");

  // Experiências
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Buscar candidato
    const { data: candidate } = await supabase
      .from("candidates")
      .select("*")
      .eq("profile_id", user.id)
      .single();

    if (candidate) {
      setCandidateId(candidate.id);
      setCity(candidate.city || "");
      setState(candidate.state || "");
      setLinkedin(candidate.linkedin_url || "");
      setPortfolio(candidate.portfolio_url || "");
      setObjective(candidate.objective || "");
      setSalary(candidate.salary_expectation?.toString() || "");
      setAvailability(candidate.availability || "");

      // Carregar experiências
      const { data: exps } = await supabase
        .from("candidate_experiences")
        .select("*")
        .eq("candidate_id", candidate.id)
        .order("start_date", { ascending: false });
      if (exps) setExperiences(exps);

      // Carregar formação
      const { data: edus } = await supabase
        .from("candidate_education")
        .select("*")
        .eq("candidate_id", candidate.id)
        .order("start_date", { ascending: false });
      if (edus) setEducation(edus);

      // Carregar habilidades
      const { data: sks } = await supabase
        .from("candidate_skills")
        .select("*")
        .eq("candidate_id", candidate.id);
      if (sks) setSkills(sks);
    } else {
      // Criar registro de candidato
      const { data: newCandidate } = await supabase
        .from("candidates")
        .insert({ profile_id: user.id })
        .select()
        .single();
      if (newCandidate) setCandidateId(newCandidate.id);
    }

    setLoading(false);
  }

  async function handleSave() {
    if (!candidateId) return;
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("candidates")
      .update({
        city: city || null,
        state: state || null,
        linkedin_url: linkedin || null,
        portfolio_url: portfolio || null,
        objective: objective || null,
        salary_expectation: salary ? parseFloat(salary) : null,
        availability: availability || null,
      })
      .eq("id", candidateId);

    if (error) {
      setMessage("Erro ao salvar: " + error.message);
    } else {
      setMessage("Currículo salvo com sucesso!");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function addSkill() {
    if (!newSkill.trim() || !candidateId) return;
    const { data } = await supabase
      .from("candidate_skills")
      .insert({ candidate_id: candidateId, skill_name: newSkill.trim() })
      .select()
      .single();
    if (data) {
      setSkills([...skills, data]);
      setNewSkill("");
    }
  }

  async function removeSkill(id: string) {
    await supabase.from("candidate_skills").delete().eq("id", id);
    setSkills(skills.filter((s) => s.id !== id));
  }

  if (loading) {
    return (
      <>
        <DashboardHeader title="Meu Currículo" subtitle="Carregando..." />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-gray" />
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Meu Currículo" subtitle="Mantenha seus dados atualizados para as vagas" />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Dados pessoais */}
        <Card>
          <h2 className="font-bold text-navy mb-4">Dados Pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="city" label="Cidade" placeholder="São Paulo" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input id="state" label="Estado" placeholder="SP" value={state} onChange={(e) => setState(e.target.value)} />
            <Input id="linkedin" label="LinkedIn" placeholder="https://linkedin.com/in/seu-perfil" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            <Input id="portfolio" label="Portfólio / Site" placeholder="https://seusite.com" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
          </div>
          <div className="mt-4">
            <label className="text-sm font-bold text-navy block mb-1.5">Objetivo profissional</label>
            <textarea
              placeholder="Descreva brevemente seu objetivo profissional..."
              rows={3}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input id="salary" label="Pretensão salarial (R$)" placeholder="5000" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
            <Input id="availability" label="Disponibilidade" placeholder="Imediata / 30 dias" value={availability} onChange={(e) => setAvailability(e.target.value)} />
          </div>
        </Card>

        {/* Experiências */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy">Experiência Profissional</h2>
          </div>
          {experiences.length === 0 && (
            <p className="text-sm text-gray">Nenhuma experiência cadastrada.</p>
          )}
          {experiences.map((exp) => (
            <div key={exp.id} className="p-4 border border-line rounded-lg mb-3">
              <p className="font-bold text-navy text-sm">{exp.position}</p>
              <p className="text-xs text-gray">{exp.company} · {exp.start_date} - {exp.end_date || "Atual"}</p>
              {exp.description && <p className="text-sm text-gray mt-2">{exp.description}</p>}
            </div>
          ))}
        </Card>

        {/* Formação */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy">Formação Acadêmica</h2>
          </div>
          {education.length === 0 && (
            <p className="text-sm text-gray">Nenhuma formação cadastrada.</p>
          )}
          {education.map((edu) => (
            <div key={edu.id} className="p-4 border border-line rounded-lg mb-3">
              <p className="font-bold text-navy text-sm">{edu.course}</p>
              <p className="text-xs text-gray">{edu.institution} · {edu.degree}</p>
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
                <button onClick={() => removeSkill(skill.id)} className="text-gray hover:text-red-500 cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nova habilidade..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              className="flex-1 h-10 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
            <Button type="button" size="sm" variant="ghost" onClick={addSkill}>
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </Card>

        {/* Mensagem e Salvar */}
        {message && (
          <p className={`text-sm p-3 rounded-lg ${message.includes("Erro") ? "bg-red-50 text-red-600" : "bg-green/10 text-green"}`}>
            {message}
          </p>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4" />
            Salvar currículo
          </Button>
        </div>
      </div>
    </>
  );
}
