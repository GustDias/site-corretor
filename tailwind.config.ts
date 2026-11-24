import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
    colors: {
        'bg-primary': '#001621',
        'bg-deep': '#000F17',
        'bg-secondary': '#00293D',
        'bg-surface': '#00293D',
        'border-subtle': '#00293D',
        accent: '#DBC1A0',
        'accent-hover': '#E7D3B9',
        'ink-primary': '#F8F6F2',
        'ink-secondary': '#B8C9D1',
        'ink-muted': '#7C97A5',
        'ink-on-accent': '#001621',
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config