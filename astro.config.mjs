import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeBlog from './src/plugins/rehype-blog.mjs';

export default defineConfig({
  site: 'https://www.skaleseed.com',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  markdown: { rehypePlugins: [rehypeBlog] },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/coming-soon'),
    }),
  ],
});
