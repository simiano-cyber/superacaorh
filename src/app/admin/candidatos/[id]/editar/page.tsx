"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

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
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const [availability, setAvailability] = useState("");

  useEffect(() => {
    loadCandidate();
  }, [id]);

  async function loadCandidate() {
    const { data } = await supabase
      .from("candidates")
      .select("*, profile:profiles(id, full_name, phone)")
      .eq("id", id)
      .single();

    if (data) {
      setProfileId(data.profile?.id || data.profile_id);
      setFullName(data.profile?.full_name || "");
      setPhone(data.profile?.phone || "");
      setCity(data.city || "");
      setState(data.state || "");
      setObjective(data.objective || "");
      setSalaryExpectation(data.salary_expectation?.toString() || "");
      setAvailability(data.availability || "");
    }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      // Update profiles table
      if (profileId) {
        await supabase
          .from("profiles")
          .update({ full_name: fullName, phone: phone || null })
          .eq("id", profileId);
      }

      // Update candidates table
      await supabase
        .from("candidates")
        .update({
          city: city || null,
          state: state || null,
          objective: objective || null,
          salary_expectation: salaryExpectation ? Number(salaryExpectation) : null,
          availability: availability || null,
        })
        .eq("id", id);

      router.push(`/admin/candidatos/${id}`);
    } catch (err) {
      alert("Erro ao salvar alterações.");
      setSaving(false);
    }
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
                <label className="block text-sm font-bold text-navy mb-1">Nome completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full h-10 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy mb-1">Telefone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy mb-1">Cidade</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy mb-1">Estado</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-10 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-navy mb-4">Informações profissionais</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-navy mb-1">Objetivo profissional</label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-vertical"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-navy mb-1">Pretensão salarial (R$)</label>
                  <input
                    type="number"
                    value={salaryExpectation}
                    onChange={(e) => setSalaryExpectation(e.target.value)}
                    className="w-full h-10 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy mb-1">Disponibilidade</label>
                  <input
                    type="text"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="Ex: Imediata, 15 dias, 30 dias"
                    className="w-full h-10 px-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" loading={saving}>
              <Save className="w-4 h-4" /> Salvar alterações
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
