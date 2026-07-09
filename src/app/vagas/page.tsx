import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { MapPin, Building2, Briefcase, Clock, Search } from "lucide-react";

// Server component — busca dados sem autenticação
async function getJobs() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("jobs")
    .select("id, title, description, city, state, work_model, contract_type, salary_range, created_at, partner:partners(company_name)")
    .eq("status", "aberta")
    .order("created_at", { ascending: false });

  return data || [];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Hoje";
  if (days === 1) return "1 dia atrás";
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
  return `${Math.floor(days / 30)} meses atrás`;
}

export default async function VagasPublicasPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
        <nav className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/images/logo-superacao-rh-horizontal.png" alt="SuperAção RH" className="h-12 object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-bold text-navy hover:text-gold-dark transition-colors">
              Entrar
            </Link>
            <Link href="/registro" className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-navy text-white text-sm font-bold hover:bg-navy-deep transition-all">
              Cadastre-se
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-soft to-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">
            Vagas Abertas
          </h1>
          <p className="text-gray max-w-lg mx-auto">
            Confira as oportunidades disponíveis e candidate-se. Seu próximo desafio profissional pode estar aqui.
          </p>
          <p className="text-sm text-gold-dark font-bold mt-4">{jobs.length} vagas disponíveis</p>
        </div>
      </section>

      {/* Lista de vagas */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        {jobs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray text-lg">Nenhuma vaga aberta no momento.</p>
            <p className="text-sm text-gray mt-2">Cadastre-se para ser notificado quando novas vagas forem publicadas.</p>
          </div>
        )}

        <div className="space-y-4">
          {jobs.map((job: any) => (
            <div key={job.id} className="bg-white border border-line rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-navy">{job.title}</h2>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray">
                    {job.partner?.company_name && (
                      <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.partner.company_name}</span>
                    )}
                    {job.city && (
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.city}{job.state ? `, ${job.state}` : ""}</span>
                    )}
                    {job.contract_type && (
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.contract_type} · {job.work_model}</span>
                    )}
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {timeAgo(job.created_at)}</span>
                  </div>
                  {job.description && (
                    <p className="text-sm text-gray mt-3 line-clamp-2">{job.description}</p>
                  )}
                  {job.salary_range && (
                    <p className="text-sm font-bold text-gold-dark mt-2">{job.salary_range}</p>
                  )}
                </div>
                <Link
                  href="/registro"
                  className="shrink-0 inline-flex items-center justify-center h-10 px-5 rounded-lg bg-navy text-white text-sm font-bold hover:bg-navy-deep transition-all"
                >
                  Candidatar-se
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-12 mt-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Não encontrou sua vaga ideal?</h2>
          <p className="text-white/70 mb-6">Cadastre seu currículo e seja notificado quando novas oportunidades surgirem.</p>
          <Link href="/registro" className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-gold text-navy font-bold hover:bg-gold-dark hover:text-white transition-all">
            Cadastrar currículo
          </Link>
        </div>
      </section>

      {/* Footer simples */}
      <footer className="bg-navy-deep py-6 text-center text-sm text-white/50">
        <p>© 2026 SuperAção RH · www.superacaorh.com.br</p>
      </footer>
    </div>
  );
}
