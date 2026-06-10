export type Lang = 'en' | 'zh';
export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'nav.work': 'Work',
    'nav.about': 'About',
    'hero.tagline': '// engineer with taste & product sense',
    'hero.intro':
      'I design and build AI products end to end — from cent-accurate engines to interfaces people enjoy using.',
    'hero.scroll': 'scroll',
    'work.label': 'Selected work',
    'work.view': 'View case',
    'highlight.label': 'Mithra CRM Quest',
    'highlight.sub': 'world rank · 2026',
    'contact.title': "Let's build something.",
    'contact.cta': 'Say hello',
    'about.title': 'About',
    'case.role': 'Role',
    'case.stack': 'Stack',
    'case.year': 'Year',
    'case.back': '← Back to work',
    'notfound.title': 'Lost in the particles.',
    'notfound.back': 'Back home',
    'footer.note': 'Built from scratch with Astro, GSAP and a few hundred particles.',
  },
  zh: {
    'nav.work': '作品',
    'nav.about': '关于',
    'hero.tagline': '// 有审美、有 product sense 的独立工程师',
    'hero.intro': '我从零到一设计并构建 AI 产品 —— 从分位精确的计算引擎,到让人愿意停留的界面。',
    'hero.scroll': '滚动',
    'work.label': '精选作品',
    'work.view': '查看案例',
    'highlight.label': 'Mithra CRM Quest',
    'highlight.sub': '全球排名 · 2026',
    'contact.title': '一起做点东西。',
    'contact.cta': '联系我',
    'about.title': '关于',
    'case.role': '角色',
    'case.stack': '技术栈',
    'case.year': '年份',
    'case.back': '← 返回作品',
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
