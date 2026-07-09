"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Building2, Mail, Phone, MapPin, Briefcase, Loader2, Users } from "lucide-react";
import Link from "next/link";

export default function ParceiroDetalhePage() {
  const { id } = useParams();
  const supabase = createClient();
  const [partner, setPartner] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [id]);

  async function loadData() {
    const { data: partnerData } = await supabase
      .from("partners")
      .select("*")
      .eq("id", id)
      .single();

    if (partnerData) setPartner(partnerData);

    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*, applications(id)")
      .eq("partner_id", id)
      .order("created_at", { ascending: false });

    if (jobsData) setJobs(jobsData);
    setLoading(false);
  }

  if (loading) {
    return (<><DashboardHeader title="Carregando..." subtitle="" /><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div></>);
  }

  if (!partner) {
    return (<><DashboardHeader title="Parceiro não encontrado" subtitle="" /><div className="p-6"><Link href="/admin/parceiros"><Button variant="ghost"><ArrowLeft className="w-4 h-4" /> Voltar</Button></Link></div></>);
  }

  const statusColors: Record<string, string> = {
    aberta: "bg-green/10 text-green",
    pausada: "bg-gold/10 text-gold-dark",
    encerrada: "bg-gray/10 text-gray",
  };

  return (
    <>
      <DashboardHeader title={partner.company_name} subtitle={partner.sector || "Empresa parceira"} />

      <div className="p-6 space-y-6 max-w-5xl">
        <Link href="/admin/parceiros">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> Voltar</Button>
        </Link>

        {/* Info do parceiro */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-navy" />
            </div>
            <div className="space-y-3 flex-1">
              <h2 className="text-xl font-bold text-navy">{partner.company_name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray">
                {partner.cnpj && <span>CNPJ: {partner.cnpj}</span>}
                {partner.sector && <span>Setor: {partner.sector}</span>}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray">
                {partner.contact_name && <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {partner.contact_name}</span>}
                {partner.contact_email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {partner.contact_email}</span>}
                {partner.contact_phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {partner.contact_phone}</span>}
                {partner.city && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {partner.city}{partner.state ? `, ${partner.state}` : ""}</span>}
              </div>
            </div>
          </div>
        </Card>

        {/* Vagas do parceiro */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy flex items-center gap-2"><Briefcase className="w-5 h-5" /> Vagas ({jobs.length})</h3>
            <Link href="/admin/vagas/nova">
              <Button size="sm" variant="ghost">+ Nova vaga</Button>
            </Link>
          </div>

          {jobs.length === 0 && <p className="text-sm text-gray">Nenhuma vaga cadastrada para este parceiro.</p>}

          <div className="space-y-3">
            {jobs.map((job) => (
              <Link key={job.id} href={`/admin/vagas/${job.id}`}>
                <div className="flex items-center justify-between py-3 border-b border-line last:border-0 hover:bg-soft/50 rounded px-2 -mx-2 transition-colors">
                  <div>
                    <p className="font-semibold text-navy text-sm">{job.title}</p>
                    <p className="text-xs text-gray">{job.work_model} · {job.contract_type} · {new Date(job.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray">{job.applications?.length || 0} candidatos</span>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColors[job.status]}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
