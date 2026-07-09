"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Search, Filter, MapPin, Mail, Loader2, Briefcase } from "lucide-react";

export default function CandidatosPage() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    const { data } = await supabase
      .from("candidates")
      .select(`
        *,
        profile:profiles(full_name, email, phone),
        skills:candidate_skills(skill_name)
      `)
      .order("created_at", { ascending: false });

    if (data) setCandidates(data);
    setLoading(false);
  }

  const filtered = candidates.filter((c) => {
    const name = c.profile?.full_name?.toLowerCase() || "";
    const email = c.profile?.email?.toLowerCase() || "";
    const city = c.city?.toLowerCase() || "";
    const skills = c.skills?.map((s: any) => s.skill_name.toLowerCase()).join(" ") || "";
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q) || city.includes(q) || skills.includes(q);
  });

  return (
    <>
      <DashboardHeader title="Candidatos" subtitle="Base de talentos cadastrados" />

      <div className="p-6 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
            <input
              type="text"
              placeholder="Buscar por nome, habilidade, cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray" />
          </div>
        )}

        {!loading && candidates.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray">Nenhum candidato cadastrado ainda.</p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {candidate.profile?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}
                </div>
                <div>
                  <p className="font-bold text-navy text-sm">{candidate.profile?.full_name || "Sem nome"}</p>
                  <p className="text-xs text-gray">{candidate.objective || "Sem objetivo definido"}</p>
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                {candidate.city && (
                  <div className="flex items-center gap-2 text-xs text-gray">
                    <MapPin className="w-3 h-3" />
                    {candidate.city}{candidate.state ? `, ${candidate.state}` : ""}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray">
                  <Mail className="w-3 h-3" />
                  {candidate.profile?.email}
                </div>
                {candidate.salary_expectation && (
                  <div className="flex items-center gap-2 text-xs text-gray">
                    <Briefcase className="w-3 h-3" />
                    R$ {Number(candidate.salary_expectation).toLocaleString("pt-BR")}
                  </div>
                )}
              </div>

              {candidate.skills && candidate.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.slice(0, 5).map((skill: any) => (
                    <span key={skill.skill_name} className="px-2 py-0.5 bg-soft rounded text-xs font-medium text-navy">
                      {skill.skill_name}
                    </span>
                  ))}
                  {candidate.skills.length > 5 && (
                    <span className="px-2 py-0.5 bg-soft rounded text-xs text-gray">
                      +{candidate.skills.length - 5}
                    </span>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
