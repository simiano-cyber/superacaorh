"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Partner } from "@/lib/types";

export default function EditarVagaPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [error, setError] = useState("");

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
  const [status, setStatus] = useState("aberta");

  useEffect(() => { loadData(); }, [id]);

  async function loadData() {
    const { data: job } = await supabase.from("jobs").select("*").eq("id", id).single();
    if (job) {
      setTitle(job.title);
      setDescription(job.description);
      setRequirements(job.requirements || "");
      setBenefits(job.benefits || "");
      setSalaryRange(job.salary_range || "");
      setCity(job.city || "");
      setState(job.state || "");
      setWorkModel(job.work_model || "presencial");
      setContractType(job.contract_type || "CLT");
      setPositionsCount(String(job.positions_count || 1));
      setPartnerId(job.partner_id || "");
      setDeadline(job.deadline || "");
      setStatus(job.status);
    }

    const { data: p } = await supabase.from("partners").select("id, company_name").order("company_name");
    if (p) setPartners(p as Partner[]);

    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error: updateError } = await supabase.from("jobs").update({
      title,
      description,
      requirements: requirements || null,
      benefits: benefits || null,
      salary_range: salaryRange || null,
      city: city || null,
      state: state || null,
      work_model: workModel,
      contract_type: contractType,
      positions_count: parseInt(positionsCount) || 1,
      partner_id: partnerId || null,
      deadline: deadline || null,
      status,
    }).eq("id", id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push(`/admin/vagas/${id}`);
  }

  if (loading) {
    return (<><DashboardHeader title="Carregando..." subtitle="" /><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div></>);
  }

  return (
    <>
      <DashboardHeader title="Editar Vaga" subtitle={title} />

      <div className="p-6 max-w-4xl">
        <Link href={`/admin/vagas/${id}`} className="inline-flex items-center gap-2 text-sm text-gray hover:text-navy mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <h2 className="font-bold text-navy mb-4">Informações da Vaga</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input id="title" label="Título *" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-navy block mb-1.5">Descrição *</label>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required
                  className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-navy block mb-1.5">Requisitos</label>
                <textarea rows={3} value={requirements} onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-navy block mb-1.5">Benefícios</label>
                <textarea rows={2} value={benefits} onChange={(e) => setBenefits(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical" />
              </div>
            </div>
          </Card>

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
              <Input id="salaryRange" label="Faixa salarial" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} />
              <Input id="city" label="Cidade" value={city} onChange={(e) => setCity(e.target.value)} />
              <Input id="state" label="Estado" value={state} onChange={(e) => setState(e.target.value)} />
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
              <div>
                <label className="text-sm font-bold text-navy block mb-1.5">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                  <option value="aberta">Aberta</option>
                  <option value="pausada">Pausada</option>
                  <option value="encerrada">Encerrada</option>
                </select>
              </div>
            </div>
          </Card>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

          <div className="flex justify-end gap-3">
            <Link href={`/admin/vagas/${id}`}><Button type="button" variant="ghost">Cancelar</Button></Link>
            <Button type="submit" loading={saving}><Save className="w-4 h-4" /> Salvar alterações</Button>
          </div>
        </form>
      </div>
    </>
  );
}
