"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { Users, Clock, AlertTriangle, Loader2 } from "lucide-react";

export default function ParceiroVagasPage() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadJobs(); }, []);

  async function loadJobs() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: partner } = await supabase
      .from("partners").select("id").eq("profile_id", user.id).single();

    if (!partner) { setLoading(false); return; }

    const { data } = await supabase
      .from("jobs")
      .select("*, applications(id, stage)")
      .eq("partner_id", partner.id)
      .order("created_at", { ascending: false });

    if (data) setJobs(data);
    setLoading(false);
  }

  function getDaysOpen(date: string) {
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  }

  if (loading) {
    return (<><DashboardHeader title="Minhas Vagas" subtitle="Carregando..." /><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div></>);
  }

  return (
    <>
      <DashboardHeader title="Minhas Vagas" subtitle="Vagas abertas pela sua empresa" />
      <div className="p-6 space-y-4">
        {jobs.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray">Nenhuma vaga encontrada para sua empresa.</p>
          </Card>
        )}
        {jobs.map((job) => {
          const days = getDaysOpen(job.created_at);
          const sla = days > 20 ? "Atenção" : "No prazo";
          return (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-navy text-lg">{job.title}</h3>
                  <p className="text-sm text-gray">Status: {job.status} · {job.work_model}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-gray">
                    <Users className="w-4 h-4" />
                    <span><strong className="text-navy">{job.applications?.length || 0}</strong> candidatos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray">
                    <Clock className="w-4 h-4" />
                    <span>{days} dias aberta</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    sla === "No prazo" ? "bg-green/10 text-green" : "bg-gold/10 text-gold-dark"
                  }`}>
                    {sla === "Atenção" && <AlertTriangle className="w-3 h-3" />}
                    {sla}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
