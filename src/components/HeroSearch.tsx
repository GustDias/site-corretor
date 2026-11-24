'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function HeroSearch() {
  const router = useRouter()
  const [finalidade, setFinalidade] = useState<'venda' | 'locacao'>('venda')
  const [localizacao, setLocalizacao] = useState('')
  const [tipo, setTipo] = useState('')
  const [faixaPreco, setFaixaPreco] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    params.set('finalidade', finalidade)
    if (localizacao) params.set('q', localizacao)
    if (tipo) params.set('tipo', tipo)
    if (faixaPreco) params.set('maxPreco', faixaPreco)
    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Abas superiores (Comprar / Alugar) */}
      <div className="inline-flex overflow-hidden rounded-t-2xl border-x border-t border-border-subtle bg-bg-primary/90 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setFinalidade('venda')}
          className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            finalidade === 'venda'
              ? 'bg-bg-secondary text-accent'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          Comprar
        </button>
        <button
          type="button"
          onClick={() => setFinalidade('locacao')}
          className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            finalidade === 'locacao'
              ? 'bg-bg-secondary text-accent'
              : 'text-ink-secondary hover:text-ink-primary'
          }`}
        >
          Alugar
        </button>
      </div>

      {/* Container dos filtros (30% #113E54) */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-3 rounded-b-2xl rounded-tr-2xl border border-border-subtle bg-bg-secondary/95 p-4 shadow-2xl backdrop-blur-md md:grid-cols-12 md:items-center"
      >
        <div className="md:col-span-4 md:border-r md:border-border-subtle md:pr-3">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Localização
          </label>
          <input
            type="text"
            placeholder="Bairro, condomínio ou cidade..."
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            className="mt-1 w-full bg-transparent text-sm text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none"
          />
        </div>

        <div className="md:col-span-3 md:border-r md:border-border-subtle md:px-3">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Tipo de Imóvel
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="mt-1 w-full bg-bg-secondary text-sm text-ink-primary focus:outline-none"
          >
            <option value="">Todos os tipos</option>
            <option value="condominio">Casa em Condomínio</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="terreno">Terreno</option>
          </select>
        </div>

        <div className="md:col-span-3 md:px-3">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Investimento até
          </label>
          <select
            value={faixaPreco}
            onChange={(e) => setFaixaPreco(e.target.value)}
            className="mt-1 w-full bg-bg-secondary text-sm text-ink-primary focus:outline-none"
          >
            <option value="">Qualquer valor</option>
            <option value="800000">Até R$ 800 mil</option>
            <option value="1500000">Até R$ 1,5 milhão</option>
            <option value="3000000">Até R$ 3 milhões</option>
            <option value="6000000">Até R$ 6 milhões</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink-on-accent transition-colors hover:bg-accent-hover"
          >
            <Search className="h-4 w-4" />
            Buscar
          </button>
        </div>
      </form>
    </div>
  )
}