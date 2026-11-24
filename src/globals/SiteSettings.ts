import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configurações do Corretor',
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/', 'layout')
      },
    ],
  },
  fields: [
    {
      name: 'nomeMarca',
      label: 'Nome do Corretor ou Imobiliária',
      type: 'text',
      required: true,
      defaultValue: 'Northbeam Realty',
    },
    {
      name: 'creci',
      label: 'CRECI',
      type: 'text',
      defaultValue: 'CRECI 000000-F',
    },
    {
      name: 'whatsapp',
      label: 'WhatsApp (apenas números com DDI, ex: 5515999999999)',
      type: 'text',
      required: true,
      defaultValue: '5515999999999',
    },
    {
      name: 'headlineHero',
      label: 'Título Principal da Home',
      type: 'text',
      defaultValue: 'ENCONTRE O ESPAÇO PERFEITO PARA O SEU ESTILO DE VIDA.',
    },
    {
      name: 'subheadlineHero',
      label: 'Subtítulo da Home',
      type: 'textarea',
      defaultValue: 'Curadoria exclusiva de imóveis de alto padrão com atendimento personalizado.',
    },
  ],
}