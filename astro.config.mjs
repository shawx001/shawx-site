import { defineConfig } from 'astro/config';

// TODO(验收后): site 换成 Shaw 自购的正式域名
export default defineConfig({
  site: 'https://shawx-site.example',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: { prefixDefaultLocale: false },
  },
});
