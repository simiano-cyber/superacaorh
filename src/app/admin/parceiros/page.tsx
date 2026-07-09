"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Plus, Search, Building2, Mail, Phone, Loader2, X } from "lucide-react";
import Link from "next/link";

export default function ParceirosPage() {
  const supabase = createClient();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form
  const [form, setForm] = useState({
    company_name: "", cnpj: "", sector: "", contact_name: "",
    contact_phone: "", contact_email: "", city: "", state: "",
  });

  useEffect(() => { loadPartners(); }, []);

  async function loadPartners() {
    const { data } = await supabase
      .from("partners")
      .select("*, jobs(id, status)")
      .order("company_name");
    if (data) setPartners(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("partners").insert(form);
    if (!error) {
      setShowForm(false);
      setForm({ company_name: "", cnpj: "", sector: "", contact_name: "", contact_phone: "", contact_email: "", city: "", state: "" });
      loadPartners();
    }
    setSaving(false);
  }

  const filtered = partners.filter(p =>
    p.company_name.toLowerCase().includes(search.toLowerCase()) ||
    p.contact_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <DashboardHeader title="Parceiros" subtitle="Empresas clientes da SuperAção RH" />

      <div className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
            <input type="text" placeholder="Buscar parceiros..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
          </div>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Novo parceiro
          </Button>
        </div>

        {/* Form novo parceiro */}
        {showForm && (
          <Card className="border-gold/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy">Novo Parceiro</h3>
              <button onClick={() => setShowForm(false)} className="cursor-pointer"><X className="w-5 h-5 text-gray" /></button>
            </div>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="pCompany" label="Nome da empresa *" value={form.company_name} onChange={(e) => setForm({...form, company_name: e.target.value})} required />
              <Input id="pCnpj" label="CNPJ" placeholder="00.000.000/0001-00" value={form.cnpj} onChange={(e) => setForm({...form, cnpj: e.target.value})} />
              <Input id="pSector" label="Setor" placeholder="Tecnologia, Varejo..." value={form.sector} onChange={(e) => setForm({...form, sector: e.target.value})} />
              <Input id="pContact" label="Contato principal" value={form.contact_name} onChange={(e) => setForm({...form, contact_name: e.target.value})} />
              <Input id="pPhone" label="Telefone" value={form.contact_phone} onChange={(e) => setForm({...form, contact_phone: e.target.value})} />
              <Input id="pEmail" label="E-mail" type="email" value={form.contact_email} onChange={(e) => setForm({...form, contact_email: e.target.value})} />
              <Input id="pCity" label="Cidade" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} />
              <Input id="pState" label="Estado" value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} />
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" loading={saving} size="sm">Salvar parceiro</Button>
              </div>
            </form>
          </Card>
        )}

        {loading && <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div>}

        {!loading && partners.length === 0 && !showForm && (
          <Card className="text-center py-12">
            <p className="text-gray mb-4">Nenhum parceiro cadastrado.</p>
            <Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Cadastrar primeiro parceiro</Button>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((partner) => {
            const activeJobs = partner.jobs?.filter((j: any) => j.status === "aberta").length || 0;
            return (
              <Link key={partner.id} href={`/admin/parceiros/${partner.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-navy" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-navy">{partner.company_name}</h3>
                      {partner.contact_name && <p className="text-sm text-gray">{partner.contact_name}</p>}
                      <div className="flex flex-col gap-1 mt-2">
                        {partner.contact_email && <span className="flex items-center gap-2 text-xs text-gray"><Mail className="w-3 h-3" /> {partner.contact_email}</span>}
                        {partner.contact_phone && <span className="flex items-center gap-2 text-xs text-gray"><Phone className="w-3 h-3" /> {partner.contact_phone}</span>}
                      </div>
                      <div className="mt-3 pt-3 border-t border-line flex justify-between items-center">
                        <span className="text-xs text-gray">{partner.city}{partner.state ? `, ${partner.state}` : ""}</span>
                        <span className="text-xs font-bold text-navy">{activeJobs} vagas ativas</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
