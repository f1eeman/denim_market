import { defineConfig, fontProviders } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://example.invalid',
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Work Sans',
      cssVariable: '--font-work-sans',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            weight: '400 800',
            style: 'normal',
            src: ['./src/assets/fonts/work-sans-latin.woff2'],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Anton',
      cssVariable: '--font-anton',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            weight: 400,
            style: 'normal',
            src: ['./src/assets/fonts/anton-latin.woff2'],
          },
        ],
      },
    },
  ],
})
