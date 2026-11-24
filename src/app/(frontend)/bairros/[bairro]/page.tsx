import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ArrowUpRight, Phone, MapPin } from 'lucide-react'
import { PropertyCard } from '@/components/PropertyCard'
import { JsonLd } from '@/components/JsonLd'

export const dynamic = 'force-dynamic'

interface BairroInfo {
  nome: string
  perfil: string
  precoM2Referencia: string
  destaques: string
  faqPergunta: string
  faqResposta: string
}

const BAIRROS_DATA: Record<string, BairroInfo> = {
  'jardim-europa': {
    nome: 'Jardim Europa',
    perfil:
      'Bairro arborizado, ruas tranquilas e forte concentração de casas de alto padrão e terrenos amplos, ideal para quem busca exclusividade e privacidade em São Paulo.',
    precoM2Referencia:
      'Referência de mercado na faixa de R$ 16,3 mil/m² (base 2026) — valores variam conforme metragem de terreno e assinatura arquitetônica.',
    destaques:
      'Proximidade ao Parque do Povo, Clubes Pinheiros e Hebraica, além de acesso rápido à Av. Faria Lima e Marginal Pinheiros.',
    faqPergunta: 'Como funciona a compra de casa no Jardim Europa com discrição?',
    faqResposta:
      'Muitas negociações de alto padrão no Jardim Europa ocorrem com sigilo e análise documental criteriosa. Conduzimos visitas individuais agendadas e due diligence completa até a escritura.',
  },
  'jardim-america': {
    nome: 'Jardim América',
    perfil:
      'Tradicional bairro-jardim com arquitetura clássica e contemporânea, ruas largas e alta liquidez no segmento residencial de luxo.',
    precoM2Referencia:
      'Alta procura por casas reformadas e terrenos preservados; avaliamos comparativos reais da quadra para garantir precisão na negociação.',
    destaques:
      'Localização estratégica nos Jardins com acesso imediato à Rua Oscar Freire, gastronomia premiada e serviços de alto nível.',
    faqPergunta: 'Jardim Europa ou Jardim América: qual escolher?',
    faqResposta:
      'A escolha depende do estilo da residência, metragem desejada e rotina familiar; avaliamos perfil de rua, insolação e liquidez de cada imóvel para apoiar a decisão.',
  },
  'alto-de-pinheiros': {
    nome: 'Alto de Pinheiros',
    perfil:
      'Predominantemente estritamente residencial (ZER), topografia marcante, praças arborizadas e forte atuação da associação de moradores.',
    precoM2Referencia:
      'Valores variam conforme topografia, rua e estado de conservação/reforma; realizamos análise comparativa detalhada por microrregião.',
    destaques:
      'Perfil horizontal preservado, proximidade ao Parque Villa-Lobos e segurança comunitária reconhecida.',
    faqPergunta: 'Por que o Alto de Pinheiros é tão procurado para casas?',
    faqResposta:
      'Pelo zoneamento estritamente residencial em grande parte do bairro, mantendo o clima de bairro-jardim, ruas calmas e excelente qualidade de vida para famílias.',
  },
  'jardim-guedala': {
    nome: 'Jardim Guedala',
    perfil:
      'Referência em casas amplas e ruas/condomínios fechados voltados a famílias que buscam espaço, lazer privativo e privacidade.',
    precoM2Referencia:
      'Excelente relação entre metragem de terreno e área construída na Zona Oeste; avaliamos cada imóvel caso a caso.',
    destaques:
      'Terrenos generosos, fácil acesso ao Shopping Cidade Jardim, Jockey Club e principais colégios internacionais.',
    faqPergunta: 'Há opções de casas em condomínio ou ruas com segurança no Jardim Guedala?',
    faqResposta:
      'Sim, a região conta com residências em bolsões residenciais e condomínios fechados com controle de acesso rigoroso.',
  },
  morumbi: {
    nome: 'Morumbi',
    perfil:
      'Região ampla com grande diversidade de condomínios fechados de alto padrão e residências de grande metragem cercadas por verde.',
    precoM2Referencia:
      'Ampla variação conforme o condomínio e padrão construtivo; apresentamos estudo comparativo completo antes de qualquer proposta.',
    destaques:
      'Infraestrutura completa de lazer e segurança nos condomínios, além de proximidade a grandes escolas e hospitais.',
    faqPergunta: 'O que avaliar antes de comprar casa em condomínio no Morumbi?',
    faqResposta:
      'Analisamos taxa condominial, regras internas, situação documental do imóvel e custos adicionais como ITBI (3% em SP), escritura e registro.',
  },
  brooklin: {
    nome: 'Brooklin',
    perfil:
      'Região com forte conectividade aos polos empresariais da Zona Sul e núcleos residenciais tranquilos de casas.',
    precoM2Referencia:
      'Alta valorização pela mobilidade e proximidade com a Berrini e Chácara Santo Antônio.',
    destaques:
      'Acesso rápido à Av. Eng. Luís Carlos Berrini, Marginal Pinheiros, Aeroporto de Congonhas e escolas bilíngues.',
    faqPergunta: 'Vale a pena morar de casa no Brooklin?',
    faqResposta:
      'Para executivos e famílias que desejam estar a poucos minutos dos centros financeiros mantendo privacidade residencial, é uma das escolhas mais práticas de São Paulo.',
  },
}

interface BairroPageProps {
  params: Promise<{ bairro: string }>
}

export async function generateMetadata({ params }: BairroPageProps): Promise<Metadata> {
  const { bairro } = await params
  const info = BAIRROS_DATA[bairro]
  if (!info) return { title: 'Bairro | Mitsu Kuzume' }

  return {
    title: `Casas à Venda no ${info.nome} | Alto Padrão em SP`,
    description: `Casas à venda no ${info.nome}, em São Paulo: perfil do bairro, referências de mercado e imóveis selecionados com Mitsu Kuzume.`,
    openGraph: {
      title: `Casas à Venda no ${info.nome} | Mitsu Kuzume`,
      description: info.perfil,
      type: 'website',
      locale: 'pt_BR',
    },
  }
}

export default async function BairroPage({ params }: BairroPageProps) {
  const { bairro } = await params
  const info = BAIRROS_DATA[bairro]
  if (!info) notFound()

  const payload = await getPayload({ config })
  const [settings, propsRes] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.find({
      collection: 'properties',
      where: {
        status: { equals: 'disponivel' },
      },
      limit: 30,
    }),
  ])

  const imoveisDoBairro = propsRes.docs.filter((doc: any) =>
    String(doc.bairro || '')
      .toLowerCase()
      .includes(info.nome.toLowerCase())
  )

  const whatsappUrl = `https://wa.me/${settings.whatsapp || '5511999999999'}?text=${encodeURIComponent(
    `Olá Mitsu, gostaria de informações sobre casas no ${info.nome} em São Paulo.`
  )}`

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: info.faqPergunta,
        acceptedAnswer: {
          '@type': 'Answer',
          text: info.faqResposta,
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-bg-primary text-ink-primary">
      <JsonLd data={faqSchema} />

      <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-primary/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-bold">
            {settings.nomeMarca || 'Mitsu Kuzume'}
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-ink-secondary md:flex">
            <Link href="/" className="hover:text-accent">Início</Link>
            <Link href="/imoveis" className="hover:text-accent">Imóveis</Link>
            <Link href="/bairros/jardim-europa" className="text-accent">Bairros</Link>
            <Link href="/quero-vender" className="hover:text-accent">Quero Vender</Link>
            <Link href="/sobre" className="hover:text-accent">Sobre</Link>
          </nav>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-ink-on-accent hover:bg-accent-hover"
          >
            <Phone className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Menu rápido entre os bairros */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {Object.entries(BAIRROS_DATA).map(([slugItem, item]) => (
            <Link
              key={slugItem}
              href={`/bairros/${slugItem}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                slugItem === bairro
                  ? 'bg-accent text-ink-on-accent'
                  : 'border border-border-subtle bg-bg-secondary/60 text-ink-secondary hover:border-accent/40 hover:text-accent'
              }`}
            >
              {item.nome}
            </Link>
          ))}
        </div>

        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
          <MapPin className="h-3.5 w-3.5" />
          Guia de Bairro · São Paulo
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Casas à Venda no {info.nome}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-secondary">{info.perfil}</p>

        {/* Cards de Dados de Mercado */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-accent/15 bg-bg-secondary p-6">
            <h2 className="text-base font-semibold text-accent">Referência de Mercado</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{info.precoM2Referencia}</p>
          </div>
          <div className="rounded-2xl border border-accent/15 bg-bg-secondary p-6">
            <h2 className="text-base font-semibold text-accent">Perfil e Localização</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{info.destaques}</p>
          </div>
        </div>

        {/* Grade de imóveis daquele bairro */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Imóveis Disponíveis no {info.nome}</h2>
          {imoveisDoBairro.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
              {imoveisDoBairro.map((imovel) => (
                <PropertyCard key={imovel.id} property={imovel} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-accent/15 bg-bg-secondary/50 p-8">
              <p className="text-sm text-ink-secondary">
                No momento não há imóveis listados publicamente para {info.nome} no catálogo.
                Consulte opções reservadas ou off-market diretamente pelo WhatsApp.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-ink-on-accent hover:bg-accent-hover"
              >
                Consultar Disponibilidade em {info.nome}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </section>

        {/* FAQ local do bairro */}
        <section className="mt-14 rounded-2xl border border-accent/15 bg-bg-secondary p-6">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">
            Dúvida Frequente
          </span>
          <h2 className="mt-1 text-lg font-semibold">{info.faqPergunta}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{info.faqResposta}</p>
        </section>
      </main>
    </div>
  )
}