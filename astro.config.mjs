// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
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