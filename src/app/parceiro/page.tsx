"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Briefcase, Users, CheckCircle, Clock, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ParceiroDashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({ open: 0, candidates: 0, hired: 0, avgDays: 0 });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Buscar partner_id
    const { data: partner } = await supabase
      .from("partners")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!partner) {
      setLoading(false);
      return;
    }

    // Buscar vagas do parceiro
    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*, applications(id, stage)")
      .eq("partner_id", partner.id)
      .order("created_at", { ascending: false });

    if (jobsData) {
      setJobs(jobsData);

      const open = jobsData.filter(j => j.status === "aberta").length;
      const allApps = jobsData.flatMap(j => j.applications || []);
      const hired = allApps.filter((a: any) => a.stage === "contratado").length;

      setStats({
        open,
        candidates: allApps.length,
        hired,
        avgDays: 18, // placeholder - calcular depois
      });
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <>
        <DashboardHeader title="Dashboard" subtitle="Carregando..." />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-gray" />
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Dashboard" subtitle="Acompanhe seus processos seletivos" />

      <div className="p-6 space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.open}</p>
              <p className="text-sm text-gray">Vagas abertas</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-gold-dark" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.candidates}</p>
              <p className="text-sm text-gray">Candidatos em processo</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.hired}</p>
              <p className="text-sm text-gray">Contratações</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center">
              <Clock className="w-6 h-6 text-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.avgDays} dias</p>
              <p className="text-sm text-gray">Tempo médio</p>
            </div>
          </Card>
        </div>

        {/* Vagas */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy">Vagas em andamento</h2>
            <Link href="/parceiro/vagas" className="text-sm text-gold-dark font-semibold hover:underline">
              Ver todas
            </Link>
          </div>

          {jobs.length === 0 && (
            <p className="text-sm text-gray py-4">Nenhuma vaga encontrada para sua empresa.</p>
          )}

          <div className="space-y-3">
            {jobs.filter(j => j.status === "aberta").slice(0, 5).map((job) => {
              const appCount = job.applications?.length || 0;
              return (
                <div key={job.id} className="flex items-center justify-between py-3 border-b border-line last:border-0">
                  <div>
                    <p className="font-semibold text-navy text-sm">{job.title}</p>
                    <p className="text-xs text-gray">{appCount} candidatos</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green/10 text-green">
                    Aberta
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
