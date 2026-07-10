import Link from "next/link";
import { Search, Users, FileText, RefreshCw, ArrowRight } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <WhatsAppButton />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
        <nav className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo-superacao-rh-horizontal.png"
              alt="SuperAção RH"
              className="h-14 object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-bold">
            <a href="#sobre" className="hover:text-gold-dark transition-colors">Sobre nós</a>
            <a href="#servicos" className="hover:text-gold-dark transition-colors">Serviços</a>
            <a href="#empresas" className="hover:text-gold-dark transition-colors">Para empresas</a>
            <a href="#candidatos" className="hover:text-gold-dark transition-colors">Para candidatos</a>
            <Link href="/vagas" className="hover:text-gold-dark transition-colors">Vagas</Link>
            <a href="#contato" className="hover:text-gold-dark transition-colors">Contato</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center h-10 px-5 rounded-lg border border-navy text-navy text-sm font-bold hover:bg-navy hover:text-white transition-all"
            >
              Entrar
            </Link>
            <Link
              href="/registro"
              className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-navy text-white text-sm font-bold hover:bg-navy-deep transition-all"
            >
              Cadastre-se
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-gradient-to-b from-white to-soft border-b-2 border-gold/30">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black text-gold-dark uppercase tracking-wide mb-4">
              Gestão em recrutamento
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-navy leading-tight mb-6">
              Conectamos talentos a{" "}
              <span className="text-gold-dark">oportunidades.</span>
            </h1>
            <p className="text-lg text-gray max-w-md mb-8">
              Soluções completas em recrutamento e seleção para impulsionar o crescimento da sua
              empresa com estratégia, cuidado e visão humana.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#contato"
                className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-navy text-white font-bold hover:bg-navy-deep transition-all"
              >
                Fale com um especialista
              </Link>
              <Link
                href="#servicos"
                className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-navy text-navy font-bold hover:bg-gold/10 hover:border-gold transition-all"
              >
                Conheça os serviços
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[48%_0_0_0] overflow-hidden shadow-2xl">
              <img
                src="/images/hero-recrutamento-pessoas.webp"
                alt="Profissionais de recrutamento analisando informações"
                className="w-full h-[450px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black text-gold-dark uppercase tracking-wide mb-4">Sobre nós</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight">
              Recrutamento com estratégia, direção e proximidade.
            </h2>
          </div>
          <div className="text-gray space-y-4">
            <p>
              A SuperAção RH atua conectando organizações aos profissionais adequados para cada
              desafio. Nosso trabalho considera competências técnicas, comportamento, cultura e os
              objetivos do negócio.
            </p>
            <p>
              Mais do que preencher vagas, buscamos apoiar decisões de pessoas com segurança,
              clareza e sensibilidade para construir relações profissionais mais consistentes.
            </p>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-20 bg-gradient-to-b from-white to-soft">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-black text-gold-dark uppercase tracking-wide mb-4">Serviços</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Como podemos ajudar sua empresa
            </h2>
            <p className="text-gray">
              Unimos estratégia, tecnologia e um olhar humano para entregar os melhores resultados.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Search className="w-7 h-7" />, title: "Recrutamento & Seleção", desc: "Encontramos os talentos ideais para sua empresa." },
              { icon: <Users className="w-7 h-7" />, title: "Avaliação de Perfis", desc: "Analisamos competências e comportamentos." },
              { icon: <FileText className="w-7 h-7" />, title: "Consultoria em RH", desc: "Soluções personalizadas para sua gestão." },
              { icon: <RefreshCw className="w-7 h-7" />, title: "Mapeamento de Talentos", desc: "Identificamos e atraímos os melhores profissionais." },
            ].map((service, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-14 h-14 mx-auto mb-4 text-navy">{service.icon}</div>
                <h3 className="font-bold text-navy mb-2">{service.title}</h3>
                <p className="text-sm text-gray">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para empresas */}
      <section id="empresas" className="py-20 bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-black text-white/70 uppercase tracking-wide mb-4">Para empresas</p>
          <h2 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight mb-8">
            Contratações mais seguras, humanas e estratégicas.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Mais assertividade", desc: "Contratações alinhadas ao perfil técnico e cultural." },
              { title: "Menos tempo e custo", desc: "Processos mais objetivos e conduzidos com método." },
              { title: "Acompanhamento completo", desc: "Presença consultiva nas etapas essenciais da seleção." },
              { title: "Visão estratégica", desc: "Leitura de pessoas conectada aos objetivos do negócio." },
            ].map((item, i) => (
              <div key={i} className="p-5 border-t border-white/20">
                <h3 className="font-bold text-gold mb-2">{item.title}</h3>
                <p className="text-sm text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para candidatos */}
      <section id="candidatos" className="py-20 bg-soft">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black text-gold-dark uppercase tracking-wide mb-4">Para candidatos</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-4">
              Cadastre seu currículo e encontre sua próxima oportunidade.
            </h2>
            <p className="text-gray mb-6">
              Crie seu perfil, candidate-se a vagas e acompanhe o andamento dos processos
              seletivos em tempo real.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-green text-white font-bold hover:bg-green/90 transition-all"
            >
              Cadastrar currículo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-line shadow-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-soft rounded-lg">
                <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">1</div>
                <span className="text-sm font-semibold text-navy">Crie sua conta gratuita</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-soft rounded-lg">
                <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">2</div>
                <span className="text-sm font-semibold text-navy">Preencha seu currículo</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-soft rounded-lg">
                <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">3</div>
                <span className="text-sm font-semibold text-navy">Candidate-se às vagas</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-soft rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white text-xs font-bold">4</div>
                <span className="text-sm font-semibold text-navy">Acompanhe em tempo real</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Propósito */}
      <section className="py-20 bg-navy text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-lg overflow-hidden border border-gold/20">
            <img
              src="/images/proposito-planta-crescimento.webp"
              alt="Planta representando crescimento"
              className="w-full h-[380px] object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-black text-gold uppercase tracking-wide mb-4">Propósito</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Nosso propósito é gerar impacto positivo através de pessoas.
            </h2>
            <p className="text-white/70">
              Acreditamos que recrutamento vai além de preencher vagas. É sobre construir relações,
              desenvolver talentos e transformar negócios com responsabilidade, confiança e direção.
            </p>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-20 bg-gradient-to-b from-white to-soft">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-black text-gold-dark uppercase tracking-wide mb-4">Contato</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-4">
              Vamos conversar sobre o próximo passo da sua empresa?
            </h2>
            <p className="text-gray">
              Fale com a SuperAção RH para entender como podemos apoiar sua necessidade de
              recrutamento e gestão de pessoas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Comercial */}
            <div className="bg-white rounded-xl border border-line shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-navy"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </div>
              <h3 className="font-bold text-navy text-lg mb-1">Comercial</h3>
              <p className="text-sm text-gray mb-4">Conheça nossos serviços e planos</p>
              <div className="space-y-3">
                <a
                  href="https://wa.me/5511994167331?text=Olá! Gostaria de informações sobre os serviços da SuperAção RH."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-11 rounded-lg bg-[#25D366] text-white font-bold text-sm hover:bg-[#20BA5C] transition-all"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
                  (11) 99416-7331
                </a>
                <a href="mailto:comercial@superacaorh.com.br" className="flex items-center justify-center gap-2 h-11 rounded-lg border border-navy text-navy font-bold text-sm hover:bg-navy hover:text-white transition-all">
                  comercial@superacaorh.com.br
                </a>
              </div>
            </div>

            {/* Vagas / Contratação */}
            <div className="bg-white rounded-xl border border-line shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-navy"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
              </div>
              <h3 className="font-bold text-navy text-lg mb-1">Vagas & Contratação</h3>
              <p className="text-sm text-gray mb-4">Envie seu currículo ou tire dúvidas</p>
              <div className="space-y-3">
                <a
                  href="https://wa.me/5511954042488?text=Olá! Gostaria de informações sobre vagas disponíveis."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-11 rounded-lg bg-[#25D366] text-white font-bold text-sm hover:bg-[#20BA5C] transition-all"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
                  (11) 95404-2488
                </a>
                <a href="mailto:vagas@superacaorh.com.br" className="flex items-center justify-center gap-2 h-11 rounded-lg border border-navy text-navy font-bold text-sm hover:bg-navy hover:text-white transition-all">
                  vagas@superacaorh.com.br
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray mt-8">📍 São Paulo, SP</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-deep text-white/70 py-12">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img src="/images/logo-superacao-rh.png" alt="SuperAção RH" className="h-16 p-2 bg-white/95 rounded-lg mb-4" />
            <p className="text-sm">Gestão em recrutamento com foco em pessoas, estratégia e resultados.</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Navegação</h3>
            <div className="space-y-2 text-sm">
              <a href="#sobre" className="block hover:text-white">Sobre nós</a>
              <a href="#servicos" className="block hover:text-white">Serviços</a>
              <a href="#empresas" className="block hover:text-white">Para empresas</a>
              <a href="#candidatos" className="block hover:text-white">Para candidatos</a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Plataforma</h3>
            <div className="space-y-2 text-sm">
              <Link href="/login" className="block hover:text-white">Acessar sistema</Link>
              <Link href="/registro" className="block hover:text-white">Cadastrar currículo</Link>
              <Link href="/candidato/vagas" className="block hover:text-white">Ver vagas</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Institucional</h3>
            <div className="space-y-2 text-sm">
              <a href="#contato" className="block hover:text-white">Contato</a>
              <a href="#" className="block hover:text-white">Política de Privacidade</a>
              <a href="#" className="block hover:text-white">Termos de Uso</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-sm">
          <span>© 2026 SuperAção RH. Todos os direitos reservados.</span>
          <span>LinkedIn · Instagram</span>
        </div>
      </footer>
    </div>
  );
}
