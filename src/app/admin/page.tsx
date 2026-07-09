"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Briefcase, Users, Building2, CheckCircle, Clock, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ jobs: 0, candidates: 0, hired: 0, partners: 0 });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentApps, setRecentApps] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    // Vagas abertas
    const { count: jobsCount } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "aberta");

    // Candidatos
    const { count: candidatesCount } = await supabase
      .from("candidates")
      .select("*", { count: "exact", head: true });

    // Contratações
    const { count: hiredCount } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("stage", "contratado");

    // Parceiros
    const { count: partnersCount } = await supabase
      .from("partners")
      .select("*", { count: "exact", head: true });

    setStats({
      jobs: jobsCount || 0,
      candidates: candidatesCount || 0,
      hired: hiredCount || 0,
      partners: partnersCount || 0,
    });

    // Vagas recentes
    const { data: jobs } = await supabase
      .from("jobs")
      .select("id, title, partner:partners(company_name), applications(id)")
      .eq("status", "aberta")
      .order("created_at", { ascending: false })
      .limit(5);

    if (jobs) setRecentJobs(jobs);

    // Atividade recente (últimas candidaturas)
    const { data: apps } = await supabase
      .from("applications")
      .select("id, stage, applied_at, candidate:candidates(profile:profiles(full_name)), job:jobs(title)")
      .order("applied_at", { ascending: false })
      .limit(5);

    if (apps) setRecentApps(apps);

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
      <DashboardHeader title="Dashboard" subtitle="Visão geral do recrutamento" />

      <div className="p-6 space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.jobs}</p>
              <p className="text-sm text-gray">Vagas abertas</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-gold-dark" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.candidates}</p>
              <p className="text-sm text-gray">Candidatos</p>
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
              <Building2 className="w-6 h-6 text-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.partners}</p>
              <p className="text-sm text-gray">Parceiros</p>
            </div>
          </Card>
        </div>

        {/* Vagas + Atividade */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy">Vagas abertas</h2>
              <Link href="/admin/vagas" className="text-sm text-gold-dark font-semibold hover:underline">
                Ver todas
              </Link>
            </div>
            {recentJobs.length === 0 && (
              <p className="text-sm text-gray py-4">Nenhuma vaga aberta.</p>
            )}
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <Link key={job.id} href={`/admin/vagas/${job.id}`}>
                  <div className="flex items-center justify-between py-3 border-b border-line last:border-0 hover:bg-soft/50 rounded px-2 -mx-2 transition-colors">
                    <div>
                      <p className="font-semibold text-navy text-sm">{job.title}</p>
                      <p className="text-xs text-gray">{job.partner?.company_name || "Sem empresa"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-navy">{job.applications?.length || 0}</p>
                      <p className="text-xs text-gray">candidatos</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-bold text-navy mb-4">Atividade recente</h2>
            {recentApps.length === 0 && (
              <p className="text-sm text-gray">Nenhuma atividade recente.</p>
            )}
            <div className="space-y-4">
              {recentApps.map((app) => (
                <div key={app.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-soft flex items-center justify-center text-gray shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-navy">
                      <strong>{app.candidate?.profile?.full_name || "Candidato"}</strong> se candidatou a <strong>{app.job?.title || "vaga"}</strong>
                    </p>
                    <p className="text-xs text-gray">
                      {new Date(app.applied_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
