// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://caniuseagents.com',
  integrations: [sitemap()],
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'cache-static-assets',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url?.startsWith('/logos/')) {
              res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
            }
            next();
          });
        },
      },
    ],
  },
});