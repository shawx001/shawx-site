export type Lang = 'en' | 'zh';
export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'nav.work': 'Work',
    'nav.about': 'About',
    'hero.intro': 'AI-native coder and designer across brands and creative products.',
    'hero.scroll': 'scroll',
    'work.label': 'Selected work',
    'work.soon': 'live soon',
    'work.live': 'visit ↗',
    'work.case': 'case study →',
    'work.back': 'Selected work',
    'highlight.label': 'Mithra CRM Quest',
    'highlight.sub': 'world rank · 2026',
    'contact.line': 'A good idea is all it takes.',
    'contact.line2': 'I always welcome new ideas, projects and collaborations.',
    'contact.connect': "Let's connect!",
    'about.title': 'About',
    'notfound.title': 'Lost in the particles.',
    'notfound.back': 'Back home',
    'footer.note': 'Built from scratch with Astro, GSAP and a few hundred particles.',
  },
  zh: {
    'nav.work': '作品',
    'nav.about': '关于',
    'hero.intro': 'AI 原生的工程师与设计师,横跨品牌与创意产品。',
    'hero.scroll': '滚动',
    'work.label': '精选作品',
    'work.soon': '即将上线',
    'work.live': '访问 ↗',
    'work.case': '查看案例 →',
    'work.back': '精选作品',
    'highlight.label': 'Mithra CRM Quest',
    'highlight.sub': '全球排名 · 2026',
    'contact.line': '只要有一个好想法就够了。',
    'contact.line2': '我永远欢迎新的想法、项目与合作。',
    'contact.connect': "Let's connect!",
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
