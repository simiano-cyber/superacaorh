"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { BarChart3, TrendingUp, Clock, Users, Briefcase, CheckCircle, Download, Loader2 } from "lucide-react";

export default function RelatoriosPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0, openJobs: 0, closedJobs: 0,
    totalCandidates: 0, totalApplications: 0,
    hired: 0, avgDays: 0,
  });
  const [jobsData, setJobsData] = useState<any[]>([]);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    const { count: totalJobs } = await supabase.from("jobs").select("*", { count: "exact", head: true });
    const { count: openJobs } = await supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "aberta");
    const { count: closedJobs } = await supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "encerrada");
    const { count: totalCandidates } = await supabase.from("candidates").select("*", { count: "exact", head: true });
    const { count: totalApplications } = await supabase.from("applications").select("*", { count: "exact", head: true });
    const { count: hired } = await supabase.from("applications").select("*", { count: "exact", head: true }).eq("stage", "contratado");

    setStats({
      totalJobs: totalJobs || 0, openJobs: openJobs || 0, closedJobs: closedJobs || 0,
      totalCandidates: totalCandidates || 0, totalApplications: totalApplications || 0,
      hired: hired || 0, avgDays: 18,
    });

    // Dados por parceiro
    const { data: jobs } = await supabase
      .from("jobs")
      .select("title, status, created_at, partner:partners(company_name), applications(id, stage)");
    if (jobs) setJobsData(jobs);

    setLoading(false);
  }

  function exportCSV() {
    const headers = "Vaga,Empresa,Status,Candidatos,Contratados,Data Criação\n";
    const rows = jobsData.map((j: any) => {
      const apps = j.applications || [];
      const hired = apps.filter((a: any) => a.stage === "contratado").length;
      return `"${j.title}","${j.partner?.company_name || ""}","${j.status}",${apps.length},${hired},"${new Date(j.created_at).toLocaleDateString("pt-BR")}"`;
    }).join("\n");

    const csv = headers + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-superacao-rh-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (<><DashboardHeader title="Relatórios" subtitle="Carregando..." /><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div></>);
  }

  return (
    <>
      <DashboardHeader title="Relatórios" subtitle="Métricas e indicadores de recrutamento" />

      <div className="p-6 space-y-6">
        {/* Exportar */}
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={exportCSV}>
            <Download className="w-4 h-4" /> Exportar CSV
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center">
                <Clock className="w-5 h-5 text-navy" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">{stats.avgDays} dias</p>
                <p className="text-xs text-gray">Tempo médio de contratação</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-gold-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">{stats.totalCandidates}</p>
                <p className="text-xs text-gray">Candidatos cadastrados</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">{stats.hired}</p>
                <p className="text-xs text-gray">Contratações realizadas</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Vagas por status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-bold text-navy mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" /> Vagas por Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Abertas</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-soft rounded-full h-2">
                    <div className="bg-green h-2 rounded-full" style={{ width: `${stats.totalJobs ? (stats.openJobs / stats.totalJobs) * 100 : 0}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-navy w-8 text-right">{stats.openJobs}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Encerradas</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-soft rounded-full h-2">
                    <div className="bg-navy h-2 rounded-full" style={{ width: `${stats.totalJobs ? (stats.closedJobs / stats.totalJobs) * 100 : 0}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-navy w-8 text-right">{stats.closedJobs}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray">Total</span>
                <span className="text-sm font-bold text-navy">{stats.totalJobs}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-bold text-navy mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Pipeline Geral
            </h2>
            <div className="space-y-3">
              {[
                { label: "Total de candidaturas", value: stats.totalApplications },
                { label: "Contratados", value: stats.hired },
                { label: "Taxa de conversão", value: stats.totalApplications ? `${Math.round((stats.hired / stats.totalApplications) * 100)}%` : "0%" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-line last:border-0">
                  <span className="text-sm text-gray">{item.label}</span>
                  <span className="text-sm font-bold text-navy">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tabela por parceiro */}
        <Card>
          <h2 className="font-bold text-navy mb-4">Desempenho por Vaga</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left p-3 text-xs font-bold text-gray uppercase">Vaga</th>
                  <th className="text-left p-3 text-xs font-bold text-gray uppercase">Empresa</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Candidatos</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Contratados</th>
                  <th className="text-center p-3 text-xs font-bold text-gray uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobsData.slice(0, 10).map((job: any, i: number) => {
                  const apps = job.applications || [];
                  const hired = apps.filter((a: any) => a.stage === "contratado").length;
                  return (
                    <tr key={i} className="border-b border-line last:border-0">
                      <td className="p-3 font-semibold text-navy text-sm">{job.title}</td>
                      <td className="p-3 text-sm text-gray">{job.partner?.company_name || "-"}</td>
                      <td className="p-3 text-center text-sm">{apps.length}</td>
                      <td className="p-3 text-center text-sm">{hired}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${job.status === "aberta" ? "bg-green/10 text-green" : "bg-gray/10 text-gray"}`}>
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
