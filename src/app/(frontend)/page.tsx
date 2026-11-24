import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ArrowUpRight, Phone } from 'lucide-react'
import { HeroSearch } from '@/components/HeroSearch'
import { PropertyCard } from '@/components/PropertyCard'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const [settings, propertiesRes] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.find({
      collection: 'properties',
      where: {
        status: { equals: 'disponivel' },
      },
      limit: 4,
      sort: '-createdAt',
    }),
  ])

  const imoveis = propertiesRes.docs
  const whatsappUrl = `https://wa.me/${settings.whatsapp || '5515999999999'}?text=${encodeURIComponent(
    'Olá! Vim pelo site e gostaria de atendimento personalizado sobre imóveis.'
  )}`

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary text-ink-primary">
      {/* === NAVBAR (60% #001621) === */}
      <header className="sticky top-0 z-40 border-b border-border-subtle/50 bg-bg-primary/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-bold tracking-tight text-ink-primary">
            {settings.nomeMarca || 'Northbeam Realty'}
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-ink-secondary md:flex">
            <Link href="/" className="text-ink-primary transition-colors hover:text-accent">
              Início
            </Link>
            <Link href="/imoveis" className="transition-colors hover:text-accent">
              Imóveis
            </Link>
            <a href="#faq" className="transition-colors hover:text-accent">
              Dúvidas
            </a>
          </nav>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-secondary/60 px-4 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent"
          >
            <Phone className="h-3.5 w-3.5" />
            Falar com Corretor
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* === HERO SECTION (60% #001621) === */}
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 md:pt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <h1 className="text-3xl font-semibold uppercase leading-[1.08] tracking-[-0.03em] text-ink-primary sm:text-5xl">
                {settings.headlineHero || 'ENCONTRE O ESPAÇO PERFEITO PARA O SEU ESTILO DE VIDA.'}
              </h1>
            </div>
            <div className="flex flex-col items-start gap-5 md:col-span-4 md:items-end md:text-right">
              <p className="text-sm leading-relaxed text-ink-secondary">
                {settings.subheadlineHero ||
                  'Curadoria exclusiva de imóveis de alto padrão com segurança jurídica e atendimento consultivo.'}
              </p>
              <Link
                href="/imoveis"
                className="inline-flex items-center gap-3 rounded-full bg-accent py-2 pl-5 pr-2 text-sm font-semibold text-ink-on-accent transition-colors hover:bg-accent-hover"
              >
                Explorar Imóveis
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-primary text-accent">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>

          {/* Imagem Arquitetônica + Caixa de Busca Flutuante */}
          <div className="relative mt-10">
            <div className="aspect-[16/9] max-h-[500px] w-full overflow-hidden rounded-2xl border border-border-subtle">
              <img
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1800&auto=format&fit=crop"
                alt="Arquitetura moderna de alto padrão"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 -mt-16 px-4 md:-mt-20 md:px-8">
              <HeroSearch />
            </div>
          </div>

          {/* Faixa de Métricas (750+ / 250M+ / 99%) */}
          <div className="mt-16 grid grid-cols-1 divide-y divide-border-subtle border-y border-border-subtle py-8 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="py-4 sm:py-0">
              <p className="font-display text-3xl font-semibold tracking-tight text-accent md:text-4xl">
                150+
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-ink-secondary">
                Imóveis Negociados
              </p>
            </div>
            <div className="py-4 sm:py-0">
              <p className="font-display text-3xl font-semibold tracking-tight text-accent md:text-4xl">
                R$ 250M+
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-ink-secondary">
                Em Volume Geral de Vendas
              </p>
            </div>
            <div className="py-4 sm:py-0">
              <p className="font-display text-3xl font-semibold tracking-tight text-accent md:text-4xl">
                99%
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-ink-secondary">
                Clientes Satisfeitos
              </p>
            </div>
          </div>
        </section>

        {/* === GRADE DE IMÓVEIS EM DESTAQUE (30% SECUNDÁRIO #113E54) === */}
        <section className="border-y border-border-subtle bg-bg-secondary py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                  Portfólio Selecionado
                </span>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-primary md:text-3xl">
                  Explore Nossos Imóveis
                </h2>
              </div>
              <Link
                href="/imoveis"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
              >
                Ver todos os imóveis
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {imoveis.length > 0 ? (
              <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                {imoveis.map((imovel) => (
                  <PropertyCard key={imovel.id} property={imovel} />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-border-subtle bg-bg-primary/50 p-12 text-center">
                <p className="text-base text-ink-secondary">
                  Nenhum imóvel cadastrado ainda. Acesse{' '}
                  <Link href="/admin" className="font-semibold text-accent underline">
                    /admin
                  </Link>{' '}
                  para adicionar o primeiro imóvel!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* === FAQ & BANNER CTA (60% #001621) === */}
        <section id="faq" className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                FAQ
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-primary md:text-3xl">
                Perguntas Frequentes
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
                Ainda tem dúvidas sobre financiamento, documentação ou avaliação do seu imóvel?
                Fale diretamente pelo WhatsApp.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-ink-on-accent transition-colors hover:bg-accent-hover"
              >
                Tirar Dúvidas
              </a>
            </div>

            <div className="space-y-3 md:col-span-7">
              {[
                {
                  q: 'Como funciona o processo de compra e financiamento imobiliário?',
                  a: 'Cuidamos de toda a análise documental, certidões negativas e aprovação de crédito junto aos principais bancos, garantindo segurança total até o registro em cartório.',
                },
                {
                  q: 'Posso anunciar meu imóvel de alto padrão no portfólio?',
                  a: 'Sim. Realizamos avaliação técnica de mercado, produção fotográfica profissional e divulgação direcionada para compradores qualificados.',
                },
                {
                  q: 'É possível agendar visitas presenciais ou por videochamada?',
                  a: 'Sim, basta clicar no botão de agendamento em qualquer imóvel para escolher o melhor horário presencialmente ou em tour guiado online.',
                },
              ].map((item, idx) => (
                <details
                  key={idx}
                  open={idx === 0}
                  className="group rounded-2xl border border-border-subtle bg-bg-secondary/40 p-5 open:bg-bg-secondary"
                >
                  <summary className="cursor-pointer list-none font-display text-sm font-medium text-ink-primary">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Banner CTA Final */}
          <div className="relative mt-20 overflow-hidden rounded-2xl border border-border-subtle">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1800&auto=format&fit=crop"
              alt="Residência contemporânea"
              className="h-72 w-full object-cover md:h-80"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/75 px-6 text-center backdrop-blur-[2px]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                Atendimento Exclusivo
              </span>
              <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-ink-primary md:text-3xl">
                Pronto para encontrar o seu próximo imóvel?
              </h2>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-accent py-2 pl-5 pr-2 text-sm font-semibold text-ink-on-accent transition-colors hover:bg-accent-hover"
              >
                Agendar Consultoria
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-primary text-accent">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* === FOOTER COM WORDMARK GIGANTE (60% #001621) === */}
      <footer className="border-t border-border-subtle bg-bg-deep pt-14 pb-8">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-display text-sm font-semibold text-ink-primary">
            {settings.nomeMarca || 'Northbeam Realty'}
          </p>
          {settings.creci && <p className="mt-1 text-xs text-accent">{settings.creci}</p>}

          <div className="mt-8 overflow-hidden">
            <p className="font-display text-4xl font-bold tracking-tighter text-ink-primary/90 sm:text-6xl md:text-7xl">
              {settings.nomeMarca || 'Northbeam Realty'}
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-6 text-xs text-ink-muted sm:flex-row">
            <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
            <Link href="/admin" className="transition-colors hover:text-accent">
              Área do Corretor
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}