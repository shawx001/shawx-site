export type Lang = 'en' | 'zh';
export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'nav.work': 'Work',
    'nav.about': 'About',
    'hero.tagline': 'code × design × art',
    'hero.intro':
      'I build AI products end to end — and treat beauty as a feature. Taste trained by art, discipline trained by shipping.',
    'hero.scroll': 'scroll',
    'work.label': 'Selected work',
    'work.soon': 'live soon',
    'work.live': 'visit ↗',
    'highlight.label': 'Mithra CRM Quest',
    'highlight.sub': 'world rank · 2026',
    'contact.title': "Let's build something.",
    'contact.cta': 'Say hello',
    'about.title': 'About',
    'notfound.title': 'Lost in the particles.',
    'notfound.back': 'Back home',
    'footer.note': 'Built from scratch with Astro, GSAP and a few hundred particles.',
  },
  zh: {
    'nav.work': '作品',
    'nav.about': '关于',
    'hero.tagline': 'code × design × art',
    'hero.intro': '从零到一构建 AI 产品,并把「美」当作功能的一部分 —— 审美来自艺术,纪律来自交付。',
    'hero.scroll': '滚动',
    'work.label': '精选作品',
    'work.soon': '即将上线',
    'work.live': '访问 ↗',
    'highlight.label': 'Mithra CRM Quest',
    'highlight.sub': '全球排名 · 2026',
    'contact.title': '一起做点东西。',
    'contact.cta': '联系我',
    'about.title': '关于',
    'notfound.title': '迷失在粒子里了。',
    'notfound.back': '回首页',
    'footer.note': '用 Astro、GSAP 和几百颗粒子亲手搭建。',
  },
} as const;

export type UiKey = keyof typeof ui.en;
export const t = (lang: Lang, key: UiKey): string => ui[lang][key] ?? ui.en[key];
export const homeOf = (lang: Lang): string => (lang === 'en' ? '/' : '/zh/');
export const switchHref = (lang: Lang, pathname: string): string =>
  lang === 'en' ? (pathname === '/' ? '/zh/' : `/zh${pathname}`) : pathname.replace(/^\/zh/, '') || '/';
