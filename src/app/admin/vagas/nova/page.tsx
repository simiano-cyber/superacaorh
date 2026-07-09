"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Save, ArrowLeft } from "lucide-react";
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

  useEffect(() => {
    loadPartners();
  }, []);

  async function loadPartners() {
    const { data } = await supabase
      .from("partners")
      .select("id, company_name")
      .order("company_name");
    if (data) setPartners(data as Partner[]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("jobs").insert({
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
      created_by: user?.id,
      status: "aberta",
    });

    if (insertError) {
      setError(insertError.message || "Erro ao criar vaga.");
      setLoading(false);
      return;
    }

    router.push("/admin/vagas");
  }

  return (
    <>
      <DashboardHeader title="Nova Vaga" subtitle="Cadastre um novo processo seletivo" />

      <div className="p-6 max-w-4xl">
        <Link href="/admin/vagas" className="inline-flex items-center gap-2 text-sm text-gray hover:text-navy mb-4">
          <ArrowLeft className="w-4 h-4" />
          Voltar para vagas
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <Card>
            <h2 className="font-bold text-navy mb-4">Informações da Vaga</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  id="title"
                  label="Título da vaga *"
                  placeholder="Ex: Analista de RH Pleno"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-navy block mb-1.5">Descrição *</label>
                <textarea
                  placeholder="Descreva as atividades e responsabilidades da vaga..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-navy block mb-1.5">Requisitos</label>
                <textarea
                  placeholder="Experiência necessária, formação, habilidades..."
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-navy block mb-1.5">Benefícios</label>
                <textarea
                  placeholder="VR, VT, plano de saúde, etc..."
                  rows={2}
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical"
                />
              </div>
            </div>
          </Card>

          {/* Detalhes */}
          <Card>
            <h2 className="font-bold text-navy mb-4">Detalhes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-navy block mb-1.5">Empresa parceira</label>
                <select
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                >
                  <option value="">Selecione (opcional)</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>{p.company_name}</option>
                  ))}
                </select>
              </div>
              <Input
                id="salaryRange"
                label="Faixa salarial"
                placeholder="R$ 5.000 - R$ 7.000"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
              />
              <Input
                id="city"
                label="Cidade"
                placeholder="São Paulo"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                id="state"
                label="Estado"
                placeholder="SP"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <div>
                <label className="text-sm font-bold text-navy block mb-1.5">Modelo de trabalho</label>
                <select
                  value={workModel}
                  onChange={(e) => setWorkModel(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                >
                  <option value="presencial">Presencial</option>
                  <option value="remoto">Remoto</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-navy block mb-1.5">Tipo de contrato</label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                >
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ</option>
                  <option value="Temporário">Temporário</option>
                  <option value="Estágio">Estágio</option>
                </select>
              </div>
              <Input
                id="positions"
                label="Número de vagas"
                type="number"
                min={1}
                value={positionsCount}
                onChange={(e) => setPositionsCount(e.target.value)}
              />
              <Input
                id="deadline"
                label="Prazo (data limite)"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </Card>

          {/* Erro e submit */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <div className="flex justify-end gap-3">
            <Link href="/admin/vagas">
              <Button type="button" variant="ghost">Cancelar</Button>
            </Link>
            <Button type="submit" loading={loading}>
              <Save className="w-4 h-4" />
              Criar vaga
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
