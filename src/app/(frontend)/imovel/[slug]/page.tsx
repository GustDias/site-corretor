import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ArrowLeft, BedDouble, Bath, Maximize2, Car, ShieldCheck, Phone } from 'lucide-react'
import { JsonLd } from '@/components/JsonLd'
import { RichTextRenderer } from '@/components/RichTextRenderer'

export const dynamic = 'force-dynamic'

interface ImovelDetalheProps {
  params: Promise<{ slug: string }>
}

async function getImovelBySlug(slug: string) {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'properties',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  })
  return res.docs[0] || null
}

export async function generateMetadata({ params }: ImovelDetalheProps): Promise<Metadata> {
  const { slug } = await params
  const imovel: any = await getImovelBySlug(slug)

  if (!imovel) {
    return { title: 'Imóvel não encontrado | Mitsu Kuzume' }
  }

  const fotoUrl =
    typeof imovel.fotoPrincipal === 'object' && imovel.fotoPrincipal?.url
      ? imovel.fotoPrincipal.url
      : undefined

  return {
    title: `${imovel.titulo} em ${imovel.bairro} | Mitsu Kuzume`,
    description: `${imovel.titulo} (${imovel.bairro}, ${imovel.cidade}). ${
      imovel.caracteristicas?.areaUtil ? `${imovel.caracteristicas.areaUtil} m²` : ''
    } · Atendimento privado e discreto.`,
    openGraph: {
      title: `${imovel.titulo} | Mitsu Kuzume`,
      description: `Imóvel em ${imovel.bairro}, ${imovel.cidade}. Agende uma visita privada.`,
      images: fotoUrl ? [{ url: fotoUrl }] : [],
      type: 'website',
      locale: 'pt_BR',
    },
  }
}

export default async function ImovelDetalhePage({ params }: ImovelDetalheProps) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const [imovel, settings] = await Promise.all([
    getImovelBySlug(slug),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  if (!imovel) {
    notFound()
  }

  const doc: any = imovel
  const capaUrl =
    typeof doc.fotoPrincipal === 'object' && doc.fotoPrincipal?.url
      ? doc.fotoPrincipal.url
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop'

  const galeriaUrls: string[] = Array.isArray(doc.galeria)
    ? doc.galeria
        .map((item: any) => (typeof item === 'object' && item?.url ? item.url : null))
        .filter(Boolean)
    : []

  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(doc.preco || 0)

  const mensagemWhatsApp = `Olá Mitsu, tenho interesse no imóvel "${doc.titulo}"${
    doc.codigoRef ? ` (Ref: ${doc.codigoRef})` : ''
  } em ${doc.bairro}. Gostaria de agendar uma visita privada.`

  const whatsappUrl = `https://wa.me/${settings.whatsapp || '5511999999999'}?text=${encodeURIComponent(
    mensagemWhatsApp
  )}`

  const listingSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: doc.titulo,
    image: capaUrl,
    offers: {
      '@type': 'Offer',
      price: doc.preco || 0,
      priceCurrency: 'BRL',
      availability:
        doc.status === 'disponivel'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: doc.cidade || 'São Paulo',
      addressRegion: 'SP',
      streetAddress: doc.bairro || '',
      addressCountry: 'BR',
    },
  }

  return (
    <div className="min-h-screen bg-bg-primary text-ink-primary">
      <JsonLd data={listingSchema} />

      <header className="border-b border-border-subtle bg-bg-primary/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-bold">
            {settings.nomeMarca || 'Mitsu Kuzume'}
          </Link>
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 text-xs font-medium text-ink-secondary hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao catálogo
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-accent">
          <span>{doc.finalidade === 'locacao' ? 'Locação' : 'Venda'}</span>
          <span>•</span>
          <span>{doc.bairro} — {doc.cidade}</span>
          {doc.codigoRef && (
            <>
              <span>•</span>
              <span className="text-ink-muted">Cód: {doc.codigoRef}</span>
            </>
          )}
        </div>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{doc.titulo}</h1>

        {/* Foto Principal */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border-subtle">
          <img
            src={capaUrl}
            alt={`${doc.titulo} em ${doc.bairro}`}
            className="aspect-[16/9] max-h-[540px] w-full object-cover"
          />
        </div>

        {/* Galeria adicional */}
        {galeriaUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {galeriaUrls.map((url, index) => (
              <div
                key={index}
                className="aspect-[4/3] overflow-hidden rounded-xl border border-border-subtle"
              >
                <img
                  src={url}
                  alt={`${doc.titulo} — foto ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Conteúdo + Box de Conversão */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-accent/15 bg-bg-secondary p-5 sm:grid-cols-4">
              <div>
                <p className="text-xs text-ink-muted">Área Útil</p>
                <p className="mt-1 flex items-center gap-1.5 font-display text-lg font-semibold text-accent">
                  <Maximize2 className="h-4 w-4" />
                  {doc.caracteristicas?.areaUtil || 0} m²
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-muted">Quartos / Suítes</p>
                <p className="mt-1 flex items-center gap-1.5 font-display text-lg font-semibold text-accent">
                  <BedDouble className="h-4 w-4" />
                  {doc.caracteristicas?.quartos || 0} / {doc.caracteristicas?.suites || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-muted">Banheiros</p>
                <p className="mt-1 flex items-center gap-1.5 font-display text-lg font-semibold text-accent">
                  <Bath className="h-4 w-4" />
                  {doc.caracteristicas?.banheiros || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-muted">Vagas</p>
                <p className="mt-1 flex items-center gap-1.5 font-display text-lg font-semibold text-accent">
                  <Car className="h-4 w-4" />
                  {doc.caracteristicas?.vagas || 0}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-accent/15 bg-bg-secondary/60 p-6">
              <h2 className="text-xl font-semibold">Sobre o Imóvel</h2>
              <div className="mt-3">
                <RichTextRenderer content={doc.descricao} />
              </div>

              {!doc.descricao?.root?.children?.length && (
                <p className="text-sm leading-relaxed text-ink-secondary">
                  Imóvel selecionado com curadoria em {doc.bairro}, {doc.cidade}.
                </p>
              )}

              <p className="mt-5 border-t border-accent/15 pt-4 text-xs leading-relaxed text-ink-muted">
                Valores, disponibilidade e condições sujeitos a confirmação sem aviso prévio.
                Recomendamos análise documental (due diligence) antes do fechamento.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-accent/20 bg-bg-secondary p-6">
              <span className="text-xs uppercase tracking-wider text-ink-muted">Valor</span>
              <p className="mt-1 font-display text-3xl font-semibold text-accent">
                {precoFormatado}
                {doc.finalidade === 'locacao' && (
                  <span className="text-sm font-normal text-ink-secondary"> /mês</span>
                )}
              </p>

              {(doc.condominio || doc.iptu) && (
                <div className="mt-4 space-y-1 border-t border-accent/15 pt-4 text-xs text-ink-secondary">
                  {doc.condominio > 0 && <p>Condomínio: R$ {doc.condominio.toLocaleString('pt-BR')}</p>}
                  {doc.iptu > 0 && <p>IPTU mensal: R$ {doc.iptu.toLocaleString('pt-BR')}</p>}
                </div>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-semibold text-ink-on-accent hover:bg-accent-hover"
              >
                <Phone className="h-4 w-4" />
                Agendar Visita Privada
              </a>

              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-secondary">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                Atendimento reservado, discreto e acompanhado do início à escritura.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}