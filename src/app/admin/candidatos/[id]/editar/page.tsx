"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { ESTADOS_BR, DISPONIBILIDADE_OPTIONS, maskPhone, maskCurrency, unmaskCurrency, unmaskPhone } from "@/lib/constants";

export default function EditarCandidatoPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [objective, setObjective] = useState("");
  const [salaryDisplay, setSalaryDisplay] = useState("");
  const [availability, setAvailability] = useState("");

  useEffect(() => { loadCandidate(); }, [id]);

  async function loadCandidate() {
    const { data } = await supabase
      .from("candidates")
      .select("*, profile:profiles(id, full_name, phone)")
      .eq("id", id)
      .single();

    if (data) {
      setProfileId(data.profile?.id || data.profile_id);
      setFullName(data.profile?.full_name || "");
      setPhone(data.profile?.phone ? maskPhone(data.profile.phone) : "");
      setCity(data.city || "");
      setState(data.state || "");
      setObjective(data.objective || "");
      setSalaryDisplay(data.salary_expectation ? maskCurrency(String(Math.round(data.salary_expectation * 100))) : "");
      setAvailability(data.availability || "");
    }
    setLoading(false);
  }

  function handlePhoneChange(value: string) {
    setPhone(maskPhone(value));
  }

  function handleSalaryChange(value: string) {
    setSalaryDisplay(maskCurrency(value));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (profileId) {
      await supabase.from("profiles").update({
        full_name: fullName,
        phone: unmaskPhone(phone) || null,
      }).eq("id", profileId);
    }

    await supabase.from("candidates").update({
      city: city || null,
      state: state || null,
      objective: objective || null,
      salary_expectation: unmaskCurrency(salaryDisplay) || null,
      availability: availability || null,
    }).eq("id", id);

    router.push(`/admin/candidatos/${id}`);
  }

  if (loading) {
    return (<><DashboardHeader title="Carregando..." subtitle="" /><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div></>);
  }

  return (
    <>
      <DashboardHeader title="Editar Candidato" subtitle={fullName} />

      <div className="p-6 max-w-3xl">
        <Link href={`/admin/candidatos/${id}`}>
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> Voltar</Button>
        </Link>

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          <Card>
            <h3 className="font-bold text-navy mb-4">Dados pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-navy mb-1">Nome completo *</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy mb-1">Telefone</label>
                <input type="text" value={phone} onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy mb-1">Estado</label>
                <select value={state} onChange={(e) => { setState(e.target.value); setCity(""); }}
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                  <option value="">Selecione o estado</option>
                  {ESTADOS_BR.map((e) => (
                    <option key={e.uf} value={e.uf}>{e.uf} — {e.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-navy mb-1">Cidade</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                  placeholder={state ? "Digite a cidade" : "Selecione o estado primeiro"}
                  disabled={!state}
                  className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:bg-soft disabled:text-gray" />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-navy mb-4">Informações profissionais</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-navy mb-1">Objetivo profissional</label>
                <textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={3}
                  placeholder="Descreva brevemente seu objetivo profissional..."
                  className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-navy mb-1">Pretensão salarial mensal</label>
                  <input type="text" value={salaryDisplay} onChange={(e) => handleSalaryChange(e.target.value)}
                    placeholder="R$ 0,00"
                    className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy mb-1">Disponibilidade</label>
                  <select value={availability} onChange={(e) => setAvailability(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                    <option value="">Selecione...</option>
                    {DISPONIBILIDADE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" loading={saving}><Save className="w-4 h-4" /> Salvar alterações</Button>
          </div>
        </form>
      </div>
    </>
  );
}
