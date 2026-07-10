"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Search, MapPin, Mail, Loader2, Briefcase, X, Phone } from "lucide-react";
import Link from "next/link";

export default function CandidatosPage() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [candidateTags, setCandidateTags] = useState<any[]>([]);

  // Filtros
  const [filterCity, setFilterCity] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Dados para os filtros
  const [cities, setCities] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => { loadCandidates(); }, []);

  async function loadCandidates() {
    const { data } = await supabase
      .from("candidates")
      .select(`
        *,
        profile:profiles(full_name, email, phone),
        skills:candidate_skills(skill_name),
        applications(id, stage)
      `)
      .order("created_at", { ascending: false });

    if (data) {
      setCandidates(data);
      const uniqueCities = [...new Set(data.map(c => c.city).filter(Boolean))] as string[];
      const uniqueSkills = [...new Set(data.flatMap(c => c.skills?.map((s: any) => s.skill_name) || []))] as string[];
      setCities(uniqueCities.sort());
      setSkills(uniqueSkills.sort());
    }

    // Carregar tags por candidato via API
    const tagsRes = await fetch("/api/admin/tags");
    const allTagsData = await tagsRes.json();
    if (Array.isArray(allTagsData)) setCandidateTags(allTagsData);

    setLoading(false);
  }

  const filtered = candidates.filter((c) => {
    const name = c.profile?.full_name?.toLowerCase() || "";
    const email = c.profile?.email?.toLowerCase() || "";
    const city = c.city?.toLowerCase() || "";
    const candidateSkills = c.skills?.map((s: any) => s.skill_name.toLowerCase()) || [];
    const q = search.toLowerCase();

    const matchSearch = !q || name.includes(q) || email.includes(q) || city.includes(q) || candidateSkills.some((s: string) => s.includes(q));
    const matchCity = !filterCity || c.city === filterCity;
    const matchSkill = !filterSkill || candidateSkills.includes(filterSkill.toLowerCase());
    const matchAvailability = !filterAvailability || c.availability?.toLowerCase().includes(filterAvailability.toLowerCase());

    return matchSearch && matchCity && matchSkill && matchAvailability;
  });

  const activeFilters = [filterCity, filterSkill, filterAvailability].filter(Boolean).length;

  function clearFilters() {
    setFilterCity(""); setFilterSkill(""); setFilterAvailability("");
  }

  return (
    <>
      <DashboardHeader title="Candidatos" subtitle="Base de talentos cadastrados" />

      <div className="p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
            <input type="text" placeholder="Buscar por nome, e-mail, habilidade, cidade..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`h-10 px-4 rounded-lg border flex items-center gap-2 text-sm cursor-pointer transition-colors ${activeFilters > 0 ? "border-gold bg-gold/10 text-gold-dark font-bold" : "border-line bg-white text-gray hover:bg-soft"}`}>
            Filtros {activeFilters > 0 && `(${activeFilters})`}
          </button>
        </div>

        {/* Painel de filtros */}
        {showFilters && (
          <Card padding="sm" className="border-gold/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-navy">Filtrar por:</span>
              {activeFilters > 0 && (
                <button onClick={clearFilters} className="text-xs text-gray hover:text-navy cursor-pointer flex items-center gap-1">
                  <X className="w-3 h-3" /> Limpar
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}
                className="h-9 px-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                <option value="">Cidade (todas)</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)}
                className="h-9 px-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                <option value="">Habilidade (todas)</option>
                {skills.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filterAvailability} onChange={(e) => setFilterAvailability(e.target.value)}
                className="h-9 px-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                <option value="">Disponibilidade (todas)</option>
                <option value="imediata">Imediata</option>
                <option value="30 dias">30 dias</option>
                <option value="60 dias">60 dias</option>
              </select>
            </div>
          </Card>
        )}

        {loading && <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div>}

        {!loading && candidates.length === 0 && (
          <Card className="text-center py-12"><p className="text-gray">Nenhum candidato cadastrado.</p></Card>
        )}

        {!loading && candidates.length > 0 && filtered.length === 0 && (
          <Card className="text-center py-8"><p className="text-gray">Nenhum candidato encontrado com esses filtros.</p></Card>
        )}

        {/* Lista em tabela */}
        {!loading && filtered.length > 0 && (
          <Card padding="sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left p-3 text-xs font-bold text-gray uppercase">Nome</th>
                    <th className="text-left p-3 text-xs font-bold text-gray uppercase">E-mail</th>
                    <th className="text-left p-3 text-xs font-bold text-gray uppercase">Cidade</th>
                    <th className="text-left p-3 text-xs font-bold text-gray uppercase">Habilidades</th>
                    <th className="text-center p-3 text-xs font-bold text-gray uppercase">Pretensão</th>
                    <th className="text-center p-3 text-xs font-bold text-gray uppercase">Processos</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((candidate) => (
                    <tr key={candidate.id} className="border-b border-line last:border-0 hover:bg-soft/50 transition-colors">
                      <td className="p-3">
                        <Link href={`/admin/candidatos/${candidate.id}`} className="hover:text-gold-dark">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {candidate.profile?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}
                            </div>
                            <span className="font-semibold text-navy text-sm">{candidate.profile?.full_name || "Sem nome"}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-gray">{candidate.profile?.email || "—"}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-gray">{candidate.city ? `${candidate.city}${candidate.state ? `, ${candidate.state}` : ""}` : "—"}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills?.slice(0, 3).map((s: any) => (
                            <span key={s.skill_name} className="px-2 py-0.5 bg-soft rounded text-xs font-medium text-navy">{s.skill_name}</span>
                          ))}
                          {candidate.skills?.length > 3 && (
                            <span className="px-2 py-0.5 bg-soft rounded text-xs text-gray">+{candidate.skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-xs text-gray">
                          {candidate.salary_expectation ? `R$ ${Number(candidate.salary_expectation).toLocaleString("pt-BR")}` : "—"}
                        </span>
                      </td>
                      <td className="p-3">
                        {(() => {
                          const apps = candidate.applications || [];
                          const total = apps.length;
                          const approved = apps.filter((a: any) => a.stage === "aprovado" || a.stage === "contratado").length;
                          const rejected = apps.filter((a: any) => a.stage === "reprovado").length;
                          const active = apps.filter((a: any) => !["reprovado", "desistente", "contratado"].includes(a.stage)).length;

                          if (total === 0) return <span className="text-xs text-gray">—</span>;

                          return (
                            <div className="flex items-center gap-1">
                              <span className="w-5 h-5 rounded-full bg-navy/10 text-navy text-[10px] font-bold flex items-center justify-center" title="Total">{total}</span>
                              {active > 0 && <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark text-[10px] font-bold flex items-center justify-center" title="Ativo">{active}</span>}
                              {approved > 0 && <span className="w-5 h-5 rounded-full bg-green/20 text-green text-[10px] font-bold flex items-center justify-center" title="Aprovado">{approved}</span>}
                              {rejected > 0 && <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold flex items-center justify-center" title="Reprovado">{rejected}</span>}
                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray p-3 border-t border-line flex items-center justify-between flex-wrap gap-2">
              <span>Mostrando {filtered.length} de {candidates.length} candidatos</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-navy"></span><span>Total</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold"></span><span>Ativo</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green"></span><span>Aprovado</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span><span>Reprovado</span></span>
              </span>
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
