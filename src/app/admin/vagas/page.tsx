"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, Search, MapPin, Building2, MoreVertical, Loader2, X } from "lucide-react";
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
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Filtros
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPartner, setFilterPartner] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterContract, setFilterContract] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*, partner:partners(company_name)")
      .order("created_at", { ascending: false });

    if (!error && data) setJobs(data as Job[]);

    const { data: p } = await supabase.from("partners").select("id, company_name").order("company_name");
    if (p) setPartners(p);

    setLoading(false);
  }

  const filteredJobs = jobs.filter((job) => {
    const matchSearch = !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.partner as any)?.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      job.city?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || job.status === filterStatus;
    const matchPartner = !filterPartner || job.partner_id === filterPartner;
    const matchModel = !filterModel || job.work_model === filterModel;
    const matchContract = !filterContract || job.contract_type === filterContract;
    return matchSearch && matchStatus && matchPartner && matchModel && matchContract;
  });

  const activeFilters = [filterStatus, filterPartner, filterModel, filterContract].filter(Boolean).length;

  function clearFilters() {
    setFilterStatus(""); setFilterPartner(""); setFilterModel(""); setFilterContract("");
  }

  return (
    <>
      <DashboardHeader title="Vagas" subtitle="Gerencie os processos seletivos" />

      <div className="p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
              <input type="text" placeholder="Buscar vagas..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`h-10 px-4 rounded-lg border flex items-center gap-2 text-sm cursor-pointer transition-colors ${activeFilters > 0 ? "border-gold bg-gold/10 text-gold-dark font-bold" : "border-line bg-white text-gray hover:bg-soft"}`}>
              Filtros {activeFilters > 0 && `(${activeFilters})`}
            </button>
          </div>
          <Link href="/admin/vagas/nova">
            <Button size="sm"><Plus className="w-4 h-4" /> Nova vaga</Button>
          </Link>
        </div>

        {/* Painel de filtros */}
        {showFilters && (
          <Card padding="sm" className="border-gold/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-navy">Filtrar por:</span>
              {activeFilters > 0 && (
                <button onClick={clearFilters} className="text-xs text-gray hover:text-navy cursor-pointer flex items-center gap-1">
                  <X className="w-3 h-3" /> Limpar filtros
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="h-9 px-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                <option value="">Status (todos)</option>
                <option value="aberta">Aberta</option>
                <option value="pausada">Pausada</option>
                <option value="encerrada">Encerrada</option>
              </select>
              <select value={filterPartner} onChange={(e) => setFilterPartner(e.target.value)}
                className="h-9 px-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                <option value="">Empresa (todas)</option>
                {partners.map(p => <option key={p.id} value={p.id}>{p.company_name}</option>)}
              </select>
              <select value={filterModel} onChange={(e) => setFilterModel(e.target.value)}
                className="h-9 px-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                <option value="">Modelo (todos)</option>
                <option value="presencial">Presencial</option>
                <option value="remoto">Remoto</option>
                <option value="hibrido">Híbrido</option>
              </select>
              <select value={filterContract} onChange={(e) => setFilterContract(e.target.value)}
                className="h-9 px-3 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                <option value="">Contrato (todos)</option>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Temporário">Temporário</option>
                <option value="Estágio">Estágio</option>
              </select>
            </div>
          </Card>
        )}

        {/* Loading */}
        {loading && <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div>}

        {/* Empty */}
        {!loading && jobs.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray mb-4">Nenhuma vaga cadastrada ainda.</p>
            <Link href="/admin/vagas/nova"><Button size="sm"><Plus className="w-4 h-4" /> Criar primeira vaga</Button></Link>
          </Card>
        )}

        {/* Resultado dos filtros */}
        {!loading && jobs.length > 0 && filteredJobs.length === 0 && (
          <Card className="text-center py-8">
            <p className="text-gray">Nenhuma vaga encontrada com esses filtros.</p>
          </Card>
        )}

        {/* Lista */}
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
                    <th className="text-center p-3 text-xs font-bold text-gray uppercase">Contrato</th>
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
                        </Link>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-navy">{(job.partner as any)?.company_name || "—"}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-gray">{job.city || "—"}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-xs text-gray capitalize">{job.work_model || "—"}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-xs text-gray">{job.contract_type || "—"}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColors[job.status]}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-xs text-gray">{new Date(job.created_at).toLocaleDateString("pt-BR")}</span>
                      </td>
                      <td className="p-3">
                        <Link href={`/admin/vagas/${job.id}`}>
                          <button className="w-8 h-8 rounded-lg hover:bg-soft flex items-center justify-center cursor-pointer">
                            <MoreVertical className="w-4 h-4 text-gray" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray p-3 border-t border-line">
              Mostrando {filteredJobs.length} de {jobs.length} vagas
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
