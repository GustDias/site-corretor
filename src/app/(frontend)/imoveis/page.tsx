import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ArrowUpRight, Phone } from 'lucide-react'
import { PropertyCard } from '@/components/PropertyCard'
import { JsonLd } from '@/components/JsonLd'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Casas à Venda em São Paulo | Mitsu Kuzume',
  description:
    'Seleção de casas de alto padrão à venda em São Paulo: condomínios fechados e bairros nobres. Agende uma visita privada com Mitsu Kuzume.',
  openGraph: {
    title: 'Casas à Venda em São Paulo | Mitsu Kuzume',
    description:
      'Curadoria privada de casas de alto padrão em SP. Atendimento pessoal e discreto.',
    type: 'website',
    locale: 'pt_BR',
  },
}

const BAIRROS_DESTAQUE = [
  { slug: 'jardim-europa', nome: 'Jardim Europa' },
  { slug: 'jardim-america', nome: 'Jardim América' },
  { slug: 'alto-de-pinheiros', nome: 'Alto de Pinheiros' },
  { slug: 'jardim-guedala', nome: 'Jardim Guedala' },
  { slug: 'morumbi', nome: 'Morumbi' },
  { slug: 'brooklin', nome: 'Brooklin' },
]

interface ImoveisPageProps {
  searchParams: Promise<{
    finalidade?: string
    tipo?: string
    q?: string
    maxPreco?: string
  }>
}

export default async function ImoveisPage({ searchParams }: ImoveisPageProps) {
  const params = await searchParams
  const payload = await getPayload({ config })

  const [settings, res] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.find({
      collection: 'properties',
      where: {
        status: { equals: 'disponivel' },
      },
      limit: 50,
      sort: '-createdAt',
    }),
  ])

  const finalidadeFiltro = params.finalidade || ''
  const tipoFiltro = params.tipo || ''
  const buscaFiltro = (params.q || '').trim().toLowerCase()
  const maxPrecoNum = params.maxPreco ? Number(params.maxPreco) : 0

  const filtrados = res.docs.filter((doc: any) => {
    if (finalidadeFiltro && doc.finalidade !== finalidadeFiltro) return false
    if (tipoFiltro && doc.tipo !== tipoFiltro) return false
    if (maxPrecoNum > 0 && Number(doc.preco || 0) > maxPrecoNum) return false
    if (buscaFiltro) {
      const alvo = `${doc.titulo || ''} ${doc.bairro || ''} ${doc.cidade || ''} ${doc.codigoRef || ''}`.toLowerCase()
      if (!alvo.includes(buscaFiltro)) return false
    }
    return true
  })

  const whatsappUrl = `https://wa.me/${settings.whatsapp || '5511999999999'}?text=${encodeURIComponent(
    'Olá Mitsu, gostaria de receber opções selecionadas de casas em São Paulo.'
  )}`

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Casas e Imóveis de Alto Padrão em São Paulo',
    description:
      'Catálogo curado de casas de alto padrão, condomínios fechados e imóveis selecionados em São Paulo.',
    numberOfItems: filtrados.length,
  }

  return (
    <div className="min-h-screen bg-bg-primary text-ink-primary">
      <JsonLd data={collectionSchema} />

      <header className="sticky top-0 z-40 border-b border-border-subtle/50 bg-bg-primary/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-bold tracking-tight text-ink-primary">
            {settings.nomeMarca || 'Mitsu Kuzume'}
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-ink-secondary md:flex">
            <Link href="/" className="hover:text-accent">Início</Link>
            <Link href="/imoveis" className="text-accent">Imóveis</Link>
            <Link href="/bairros/jardim-europa" className="hover:text-accent">Bairros</Link>
            <Link href="/quero-vender" className="hover:text-accent">Quero Vender</Link>
            <Link href="/sobre" className="hover:text-accent">Sobre</Link>
          </nav>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-ink-on-accent hover:bg-accent-hover"
          >
            <Phone className="h-3.5 w-3.5" />
            Visita Privada
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
          Curadoria Privada · São Paulo
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Casas e Imóveis à Venda em São Paulo
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-secondary">
          Seleção criteriosa em bairros residenciais e condomínios fechados. Caso procure um imóvel
          off-market ou fora do catálogo público, fale diretamente para atendimento reservado.
        </p>

        {/* Barra de Filtros */}
        <form
          method="GET"
          className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-border-subtle bg-bg-secondary p-4 md:grid-cols-5"
        >
          <select
            name="finalidade"
            defaultValue={finalidadeFiltro}
            className="rounded-xl border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-ink-primary"
          >
            <option value="">Venda e Locação</option>
            <option value="venda">Venda</option>
            <option value="locacao">Locação</option>
          </select>

          <select
            name="tipo"
            defaultValue={tipoFiltro}
            className="rounded-xl border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-ink-primary"
          >
            <option value="">Todos os tipos</option>
            <option value="condominio">Casa em Condomínio</option>
            <option value="casa">Casa de Rua</option>
            <option value="apartamento">Apartamento</option>
            <option value="terreno">Terreno</option>
          </select>

          <input
            type="text"
            name="q"
            defaultValue={params.q || ''}
            placeholder="Bairro, condomínio ou ref..."
            className="rounded-xl border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted"
          />

          <select
            name="maxPreco"
            defaultValue={params.maxPreco || ''}
            className="rounded-xl border border-border-subtle bg-bg-primary px-3 py-2.5 text-sm text-ink-primary"
          >
            <option value="">Qualquer valor</option>
            <option value="3000000">Até R$ 3 mi</option>
            <option value="5000000">Até R$ 5 mi</option>
            <option value="10000000">Até R$ 10 mi</option>
            <option value="25000000">Até R$ 25 mi</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-ink-on-accent hover:bg-accent-hover"
          >
            Filtrar Imóveis
          </button>
        </form>

        {/* Atalhos para Páginas de Bairro (SEO) */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-muted">Guias por bairro:</span>
          {BAIRROS_DESTAQUE.map((b) => (
            <Link
              key={b.slug}
              href={`/bairros/${b.slug}`}
              className="rounded-full border border-border-subtle bg-bg-secondary/60 px-3 py-1 text-xs text-ink-secondary hover:border-accent hover:text-accent"
            >
              {b.nome}
            </Link>
          ))}
        </div>

        {/* Grade de Resultados */}
        <div className="mt-10">
          <p className="mb-6 text-xs uppercase tracking-wider text-ink-secondary">
            {filtrados.length} {filtrados.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </p>

          {filtrados.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filtrados.map((imovel) => (
                <PropertyCard key={imovel.id} property={imovel} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border-subtle bg-bg-secondary/40 p-10 text-center">
              <p className="text-sm text-ink-secondary">
                Nenhum imóvel corresponde exatamente aos filtros atuais. Fale direto para buscar
                opções na carteira ou via rede de parceiros.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-ink-on-accent"
              >
                Consultar Busca Sob Medida
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}