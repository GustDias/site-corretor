import Link from 'next/link'
import { BedDouble, Bath, Maximize2, Car } from 'lucide-react'

export function PropertyCard({ property }: { property: any }) {
  const imageUrl =
    typeof property.fotoPrincipal === 'object' && property.fotoPrincipal?.url
      ? property.fotoPrincipal.url
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop'

  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(property.preco || 0)

  return (
    <Link href={`/imovel/${property.slug}`} className="group block">
      {/* Imagem 16:10 com borda arredondada */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-primary">
        <img
          src={imageUrl}
          alt={property.titulo}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3.5 top-3.5 rounded-full bg-bg-primary/90 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent backdrop-blur-sm">
          {property.finalidade === 'locacao' ? 'Locação' : 'Venda'}
        </span>
      </div>

      {/* Informações abaixo da foto (estilo clean da referência) */}
      <div className="pt-4">
        <h3 className="text-lg font-medium tracking-tight text-ink-primary transition-colors group-hover:text-accent">
          {property.titulo}
        </h3>
        <p className="mt-1 text-sm text-ink-secondary">
          {property.bairro} • {property.cidade}
        </p>

        {/* Ficha técnica */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-secondary">
          {property.caracteristicas?.quartos > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5 text-accent" />
              {property.caracteristicas.quartos} Quartos
            </span>
          )}
          {property.caracteristicas?.banheiros > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-3.5 w-3.5 text-accent" />
              {property.caracteristicas.banheiros} Banheiros
            </span>
          )}
          {property.caracteristicas?.areaUtil > 0 && (
            <span className="flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5 text-accent" />
              {property.caracteristicas.areaUtil} m²
            </span>
          )}
          {property.caracteristicas?.vagas > 0 && (
            <span className="flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5 text-accent" />
              {property.caracteristicas.vagas} Vagas
            </span>
          )}
        </div>

        {/* Valor em destaque 10% */}
        <p className="mt-3 text-lg font-semibold tracking-tight text-accent">
          {precoFormatado}
          {property.finalidade === 'locacao' && (
            <span className="text-xs font-normal text-ink-secondary"> /mês</span>
          )}
        </p>
      </div>
    </Link>
  )
}