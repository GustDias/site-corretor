import React from 'react'
import './styles.css'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-jakarta',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Imóveis de Alto Padrão | Curadoria Exclusiva',
  description: 'Encontre o espaço perfeito para o seu estilo de vida.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-bg-primary text-ink-primary selection:bg-accent selection:text-ink-on-accent">
        {children}
      </body>
    </html>
  )
}
