"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Save, ArrowLeft, Plus, X, GripVertical, Zap } from "lucide-react";
import Link from "next/link";
import type { Partner } from "@/lib/types";

export default function NovaVagaPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [workModel, setWorkModel] = useState("presencial");
  const [contractType, setContractType] = useState("CLT");
  const [positionsCount, setPositionsCount] = useState("1");
  const [partnerId, setPartnerId] = useState("");
  const [deadline, setDeadline] = useState("");

  // Pipeline
  const [allStages, setAllStages] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedStages, setSelectedStages] = useState<any[]>([]);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: p } = await supabase.from("partners").select("id, company_name").order("company_name");
    if (p) setPartners(p as Partner[]);

    // Carregar etapas disponíveis
    const { data: stages } = await supabase.from("pipeline_stages").select("*").order("name");
    if (stages) setAllStages(stages);

    // Carregar templates
    const { data: tmpl } = await supabase
      .from("pipeline_templates")
      .select("*, stages:pipeline_template_stages(position, stage:pipeline_stages(id, name, stage_type))")
      .order("name");
    if (tmpl) setTemplates(tmpl);

    // Aplicar template padrão
    if (tmpl && tmpl.length > 0) {
      const defaultTemplate = tmpl.find((t: any) => t.name === "Processo Padrão") || tmpl[0];
      applyTemplate(defaultTemplate);
    }
  }

  function applyTemplate(template: any) {
    const stages = template.stages
      ?.sort((a: any, b: any) => a.position - b.position)
      .map((ts: any) => ts.stage);
    if (stages) setSelectedStages(stages);
  }

  function addStage(stage: any) {
    if (!selectedStages.find(s => s.id === stage.id)) {
      setSelectedStages([...selectedStages, stage]);
    }
  }

  function removeStage(stageId: string) {
    setSelectedStages(selectedStages.filter(s => s.id !== stageId));
  }

  function moveStage(index: number, direction: "up" | "down") {
    const newStages = [...selectedStages];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newStages.length) return;
    [newStages[index], newStages[swapIndex]] = [newStages[swapIndex], newStages[index]];
    setSelectedStages(newStages);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedStages.length < 2) {
      setError("Selecione pelo menos 2 etapas para o pipeline.");
      return;
    }

    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    // Criar vaga
    const { data: job, error: insertError } = await supabase.from("jobs").insert({
      title, description,
      requirements: requirements || null,
      benefits: benefits || null,
      salary_range: salaryRange || null,
      city: city || null, state: state || null,
      work_model: workModel, contract_type: contractType,
      positions_count: parseInt(positionsCount) || 1,
      partner_id: partnerId || null,
      deadline: deadline || null,
      created_by: user?.id,
      status: "aberta",
    }).select("id").single();

    if (insertError || !job) {
      setError(insertError?.message || "Erro ao criar vaga.");
      setLoading(false);
      return;
    }

    // Salvar pipeline da vaga
    const pipelineData = selectedStages.map((stage, index) => ({
      job_id: job.id,
      stage_id: stage.id,
      position: index + 1,
    }));

    await supabase.from("job_pipeline").insert(pipelineData);

    router.push(`/admin/vagas/${job.id}`);
  }

  const stageTypeColors: Record<string, string> = {
    triagem: "bg-gray/10 text-gray",
    teste: "bg-navy/10 text-navy",
    entrevista: "bg-gold/10 text-gold-dark",
    proposta: "bg-green/10 text-green",
    contratacao: "bg-green/20 text-green",
    outro: "bg-soft text-navy",
  };

  const stageTypeLabels: Record<string, string> = {
    triagem: "Triagem",
    teste: "Teste",
    entrevista: "Entrevista",
    proposta: "Proposta",
    contratacao: "Contratação",
    outro: "Outro",
  };

  return (
    <>
      <DashboardHeader title="Nova Vaga" subtitle="Cadastre um novo processo seletivo" />

      <div className="p-6 max-w-4xl">
        <Link href="/admin/vagas" className="inline-flex items-center gap-2 text-sm text-gray hover:text-navy mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar para vagas
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <Card>
            <h2 className="font-bold text-navy mb-4">Informações da Vaga</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input id="title" label="Título da vaga *" placeholder="Ex: Analista de RH Pleno" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-navy block mb-1.5">Descrição *</label>
                <textarea placeholder="Descreva as atividades e responsabilidades..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required
                  className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-navy block mb-1.5">Requisitos</label>
                <textarea placeholder="Experiência, formação, habilidades..." rows={3} value={requirements} onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-navy block mb-1.5">Benefícios</label>
                <textarea placeholder="VR, VT, plano de saúde..." rows={2} value={benefits} onChange={(e) => setBenefits(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical" />
              </div>
            </div>
          </Card>

          {/* Detalhes */}
          <Card>
            <h2 className="font-bold text-navy mb-4">Detalhes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-navy block mb-1.5">Empresa parceira</label>
                <select value={partnerId} onChange={(e) => setPartnerId(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                  <option value="">Selecione (opcional)</option>
                  {partners.map((p) => (<option key={p.id} value={p.id}>{p.company_name}</option>))}
                </select>
              </div>
              <Input id="salaryRange" label="Faixa salarial" placeholder="R$ 5.000 - R$ 7.000" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} />
              <Input id="city" label="Cidade" placeholder="São Paulo" value={city} onChange={(e) => setCity(e.target.value)} />
              <Input id="state" label="Estado" placeholder="SP" value={state} onChange={(e) => setState(e.target.value)} />
              <div>
                <label className="text-sm font-bold text-navy block mb-1.5">Modelo de trabalho</label>
                <select value={workModel} onChange={(e) => setWorkModel(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                  <option value="presencial">Presencial</option>
                  <option value="remoto">Remoto</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-navy block mb-1.5">Tipo de contrato</label>
                <select value={contractType} onChange={(e) => setContractType(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ</option>
                  <option value="Temporário">Temporário</option>
                  <option value="Estágio">Estágio</option>
                </select>
              </div>
              <Input id="positions" label="Número de vagas" type="number" min={1} value={positionsCount} onChange={(e) => setPositionsCount(e.target.value)} />
              <Input id="deadline" label="Prazo" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </Card>

          {/* Pipeline configurável */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-navy">Pipeline do Processo</h2>
                <p className="text-xs text-gray mt-1">Configure as etapas que essa vaga terá</p>
              </div>
            </div>

            {/* Templates rápidos */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray uppercase mb-2">Aplicar template:</p>
              <div className="flex flex-wrap gap-2">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => applyTemplate(tmpl)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-white text-xs font-bold text-navy hover:border-gold hover:bg-gold/5 transition-colors cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Etapas selecionadas (pipeline da vaga) */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray uppercase mb-2">Etapas da vaga ({selectedStages.length}):</p>
              <div className="space-y-2">
                {selectedStages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center gap-2 p-2.5 bg-soft rounded-lg group">
                    <GripVertical className="w-4 h-4 text-gray/50" />
                    <span className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold shrink-0">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-navy">{stage.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${stageTypeColors[stage.stage_type]}`}>
                      {stageTypeLabels[stage.stage_type]}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => moveStage(index, "up")} disabled={index === 0}
                        className="w-6 h-6 rounded flex items-center justify-center text-gray hover:bg-white cursor-pointer disabled:opacity-30">↑</button>
                      <button type="button" onClick={() => moveStage(index, "down")} disabled={index === selectedStages.length - 1}
                        className="w-6 h-6 rounded flex items-center justify-center text-gray hover:bg-white cursor-pointer disabled:opacity-30">↓</button>
                      <button type="button" onClick={() => removeStage(stage.id)}
                        className="w-6 h-6 rounded flex items-center justify-center text-red-500 hover:bg-red-50 cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adicionar etapa */}
            <div>
              <p className="text-xs font-bold text-gray uppercase mb-2">Adicionar etapa:</p>
              <div className="flex flex-wrap gap-2">
                {allStages
                  .filter(s => !selectedStages.find(ss => ss.id === s.id))
                  .map((stage) => (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => addStage(stage)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-line text-xs font-medium text-gray hover:border-gold hover:text-navy hover:bg-gold/5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      {stage.name}
                    </button>
                  ))}
              </div>
            </div>
          </Card>

          {/* Erro e submit */}
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

          <div className="flex justify-end gap-3">
            <Link href="/admin/vagas"><Button type="button" variant="ghost">Cancelar</Button></Link>
            <Button type="submit" loading={loading}><Save className="w-4 h-4" /> Criar vaga</Button>
          </div>
        </form>
      </div>
    </>
  );
}
