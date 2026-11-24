import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Properties: CollectionConfig = {
  slug: 'properties',
  labels: {
    singular: 'Imóvel',
    plural: 'Imóveis',
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'finalidade', 'tipo', 'preco', 'bairro', 'status'],
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidatePath('/')
        revalidatePath('/imoveis')
        if (doc.slug) {
          revalidatePath(`/imovel/${doc.slug}`)
        }
      },
    ],
  },
  fields: [
    {
      name: 'titulo',
      label: 'Título do Imóvel',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug (URL amigável)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Ex: casa-alto-padrao-campolim',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.titulo) {
              return data.titulo
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'codigoRef',
      label: 'Código de Referência',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Ex: REF-001',
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'disponivel',
      options: [
        { label: 'Disponível', value: 'disponivel' },
        { label: 'Reservado', value: 'reservado' },
        { label: 'Vendido', value: 'vendido' },
        { label: 'Alugado', value: 'alugado' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'destaque',
      label: 'Exibir em Destaque na Home',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'finalidade',
          label: 'Finalidade',
          type: 'select',
          required: true,
          defaultValue: 'venda',
          options: [
            { label: 'Venda', value: 'venda' },
            { label: 'Locação', value: 'locacao' },
          ],
        },
        {
          name: 'tipo',
          label: 'Tipo de Imóvel',
          type: 'select',
          required: true,
          defaultValue: 'casa',
          options: [
            { label: 'Casa em Condomínio', value: 'condominio' },
            { label: 'Casa', value: 'casa' },
            { label: 'Apartamento', value: 'apartamento' },
            { label: 'Terreno', value: 'terreno' },
            { label: 'Comercial', value: 'comercial' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'preco',
          label: 'Valor (R$)',
          type: 'number',
          required: true,
        },
        {
          name: 'condominio',
          label: 'Condomínio (R$)',
          type: 'number',
        },
        {
          name: 'iptu',
          label: 'IPTU Mensal (R$)',
          type: 'number',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'cidade',
          label: 'Cidade',
          type: 'text',
          required: true,
        },
        {
          name: 'bairro',
          label: 'Bairro / Condomínio',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'caracteristicas',
      label: 'Ficha Técnica',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'areaUtil', label: 'Área Útil (m²)', type: 'number', required: true },
            { name: 'quartos', label: 'Quartos', type: 'number', defaultValue: 0 },
            { name: 'suites', label: 'Suítes', type: 'number', defaultValue: 0 },
            { name: 'banheiros', label: 'Banheiros', type: 'number', defaultValue: 0 },
            { name: 'vagas', label: 'Vagas', type: 'number', defaultValue: 0 },
          ],
        },
      ],
    },
    {
      name: 'fotoPrincipal',
      label: 'Foto Principal (Capa)',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'galeria',
      label: 'Galeria de Fotos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'descricao',
      label: 'Descrição Completa',
      type: 'richText',
    },
  ],
}