"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, Search, MapPin, Building2, MoreVertical, Loader2 } from "lucide-react";
import type { Job } from "@/lib/types";
import Link from "next/link";

const statusColors: Record<string, string> = {
  aberta: "bg-green/10 text-green",
  pausada: "bg-gold/10 text-gold-dark",
  encerrada: "bg-gray/10 text-gray",
};

export default function VagasPage() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*, partner:partners(company_name)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setJobs(data as Job[]);
    }
    setLoading(false);
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.partner as any)?.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      job.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <DashboardHeader title="Vagas" subtitle="Gerencie os processos seletivos" />

      <div className="p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
              <input
                type="text"
                placeholder="Buscar vagas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>
          </div>
          <Link href="/admin/vagas/nova">
            <Button size="sm">
              <Plus className="w-4 h-4" />
              Nova vaga
            </Button>
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray" />
          </div>
        )}

        {/* Empty state */}
        {!loading && jobs.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray mb-4">Nenhuma vaga cadastrada ainda.</p>
            <Link href="/admin/vagas/nova">
              <Button size="sm">
                <Plus className="w-4 h-4" />
                Criar primeira vaga
              </Button>
            </Link>
          </Card>
        )}

        {/* Lista de vagas */}
        {!loading && filteredJobs.length > 0 && (
          <Card padding="sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left p-3 text-xs font-bold text-gray uppercase">Vaga</th>
                    <th className="text-left p-3 text-xs font-bold text-gray uppercase">Empresa</th>
                    <th className="text-left p-3 text-xs font-bold text-gray uppercase">Local</th>
                    <th className="text-center p-3 text-xs font-bold text-gray uppercase">Modelo</th>
                    <th className="text-center p-3 text-xs font-bold text-gray uppercase">Status</th>
                    <th className="text-center p-3 text-xs font-bold text-gray uppercase">Data</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="border-b border-line last:border-0 hover:bg-soft/50 transition-colors">
                      <td className="p-3">
                        <Link href={`/admin/vagas/${job.id}`} className="hover:text-gold-dark">
                          <p className="font-semibold text-navy text-sm">{job.title}</p>
                          <p className="text-xs text-gray">{job.contract_type}</p>
                        </Link>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray" />
                          <span className="text-sm text-navy">
                            {(job.partner as any)?.company_name || "Sem empresa"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray" />
                          <span className="text-sm text-gray">{job.city || "-"}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-xs text-gray">{job.work_model || "-"}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColors[job.status]}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-xs text-gray">
                          {new Date(job.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button className="w-8 h-8 rounded-lg hover:bg-soft flex items-center justify-center cursor-pointer">
                          <MoreVertical className="w-4 h-4 text-gray" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
