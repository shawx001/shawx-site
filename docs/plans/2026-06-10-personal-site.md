# Shaw X 个人网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按已批准设计文档(`docs/specs/2026-06-10-personal-site-design.md`)在本地搭出完整可验收的双语粒子动效作品集网站,不部署。

**Architecture:** Astro 5 静态站 + 内置 i18n(`/` 英文、`/zh/` 中文)+ Content Collections(项目 = Markdown)。动效层为渐进增强:原生 canvas 粒子 X(聚合→星云→滚动散开)+ Lenis 平滑滚动 + GSAP ScrollTrigger 滚动编排;无 JS / reduced-motion 时内容完整可读。

**Tech Stack:** Astro ^5 / TypeScript strict / gsap / lenis / @fontsource(Fraunces, Inter, JetBrains Mono)/ 原生 Canvas 2D。

**环境(已就绪):** 便携 Node v24.16.0 位于 `C:\Users\shawx\tools\node`(已加入用户 PATH;当前会话调用需用 `& "C:\Users\shawx\tools\node\npm.cmd" ...` 完整路径)。仓库:`C:\Users\shawx\Desktop\shawx-site`,所有命令在该目录执行。

**验证基线(每个 Task 的硬门):** `npm run build` 零错误;Task 9 用 Claude Preview 浏览器实测截图。

**素材占位符策略:** 邮箱 `hello@shawx.dev`、GitHub/LinkedIn `#`、照片用色块占位、域名留 TODO —— 全部集中记录在 README「验收待填清单」。

---

### Task 1: Astro 脚手架

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro`(临时占位)

- [ ] **Step 1: 写配置文件**

`package.json`:
```json
{
  "name": "shawx-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  }
}
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shawx-site.example',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: { prefixDefaultLocale: false },
  },
});
```

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*"],
  "exclude": ["dist"]
}
```

`.gitignore`:
```
node_modules/
dist/
.astro/
```

`src/pages/index.astro`(占位,Task 7 重写):
```astro
---
---
<html><body><h1>placeholder</h1></body></html>
```

- [ ] **Step 2: 安装依赖**

```powershell
& "C:\Users\shawx\tools\node\npm.cmd" install astro gsap lenis @fontsource/fraunces @fontsource/inter @fontsource/jetbrains-mono
& "C:\Users\shawx\tools\node\npm.cmd" install -D @astrojs/check typescript
```
Expected: 无 ERR;`package.json` 出现 dependencies。

- [ ] **Step 3: 构建验证**

```powershell
& "C:\Users\shawx\tools\node\npm.cmd" run build
```
Expected: `Complete!`,产出 `dist/`。

- [ ] **Step 4: Commit** `chore: scaffold Astro project with i18n config`

---

### Task 2: 设计令牌 + 基础布局 + i18n 字典

**Files:**
- Create: `src/styles/global.css`, `src/i18n/ui.ts`, `src/layouts/Base.astro`

- [ ] **Step 1: `src/styles/global.css`** — 色板/字体令牌、重置、通用类、Lenis 配套:

```css
:root {
  --bg: #FAF6EE; --ink: #2C2418; --ink-2: #6F6353; --accent: #D85A30;
  --card: #241E17; --card-ink: #F5EFE4; --card-ink-2: #C9BCA6; --card-line: #4A4034;
  --hairline: #E5DCCB;
  --serif: 'Fraunces', Georgia, 'Songti SC', serif;
  --sans: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, Consolas, monospace;
}
* { box-sizing: border-box; }
html { background: var(--bg); scroll-behavior: smooth; }
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
body { margin: 0; font-family: var(--sans); color: var(--ink); font-size: 16px; line-height: 1.7; }
h1, h2, h3 { font-family: var(--serif); font-weight: 500; line-height: 1.15; margin: 0; }
a { color: inherit; text-decoration: none; }
.container { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
.mono { font-family: var(--mono); }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.section-label { font-family: var(--mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-2); }
.section-label .idx { color: var(--accent); }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 2: `src/i18n/ui.ts`** — 全站双语字典 + 工具函数(完整键表,中英一一对应;后续组件只用 `t(lang, key)`):

```ts
export type Lang = 'en' | 'zh';
export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'nav.work': 'Work', 'nav.about': 'About',
    'hero.tagline': '// engineer with taste & product sense',
    'hero.intro': 'I design and build AI products end to end — from cent-accurate engines to interfaces people enjoy using.',
    'hero.scroll': 'scroll',
    'work.label': 'Selected work', 'work.view': 'View case',
    'highlight.label': 'Mithra CRM Quest', 'highlight.sub': 'world rank · 2026',
    'contact.title': "Let's build something.", 'contact.cta': 'Say hello',
    'about.title': 'About',
    'case.role': 'Role', 'case.stack': 'Stack', 'case.year': 'Year', 'case.back': '← Back to work',
    'notfound.title': 'Lost in the particles.', 'notfound.back': 'Back home',
    'footer.note': 'Built from scratch with Astro, GSAP and a few hundred particles.',
  },
  zh: {
    'nav.work': '作品', 'nav.about': '关于',
    'hero.tagline': '// 有审美、有 product sense 的独立工程师',
    'hero.intro': '我从零到一设计并构建 AI 产品 —— 从分位精确的计算引擎,到让人愿意停留的界面。',
    'hero.scroll': '滚动',
    'work.label': '精选作品', 'work.view': '查看案例',
    'highlight.label': 'Mithra CRM Quest', 'highlight.sub': '全球排名 · 2026',
    'contact.title': '一起做点东西。', 'contact.cta': '联系我',
    'about.title': '关于',
    'case.role': '角色', 'case.stack': '技术栈', 'case.year': '年份', 'case.back': '← 返回作品',
    'notfound.title': '迷失在粒子里了。', 'notfound.back': '回首页',
    'footer.note': '用 Astro、GSAP 和几百颗粒子亲手搭建。',
  },
} as const;

export type UiKey = keyof typeof ui.en;
export const t = (lang: Lang, key: UiKey): string => ui[lang][key] ?? ui.en[key];
export const homeOf = (lang: Lang) => (lang === 'en' ? '/' : '/zh/');
export const switchHref = (lang: Lang, pathname: string) =>
  lang === 'en' ? (pathname === '/' ? '/zh/' : `/zh${pathname}`) : (pathname.replace(/^\/zh/, '') || '/');
```

- [ ] **Step 3: `src/layouts/Base.astro`** — 字体引入、meta/OG、favicon:

```astro
---
import '@fontsource/fraunces/500.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/jetbrains-mono/400.css';
import '../styles/global.css';
import type { Lang } from '../i18n/ui';
interface Props { lang: Lang; title: string; description: string; }
const { lang, title, description } = Astro.props;
---
<!doctype html>
<html lang={lang === 'zh' ? 'zh-CN' : 'en'}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body><slot /></body>
</html>
```

- [ ] **Step 4: build 验证 + Commit** `feat: design tokens, base layout, bilingual ui dictionary`

---

### Task 3: 内容集合 + 项目内容

**Files:**
- Create: `src/content.config.ts`, `src/lib/work.ts`, `src/content/work/{en,zh}/taxglobal-ai.md`, `src/content/work/{en,zh}/mithra-quest.md`

- [ ] **Step 1: `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    year: z.number(),
    cover: z.string().optional(),
    featured: z.boolean().default(true),
    order: z.number().default(99),
  }),
});
export const collections = { work };
```

- [ ] **Step 2: `src/lib/work.ts`** — 列表 + 中文缺失回退英文(spec §4/§10):

```ts
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type WorkEntry = CollectionEntry<'work'>;
export const slugOf = (e: WorkEntry) => e.id.split('/')[1];

export async function getWork(lang: Lang): Promise<WorkEntry[]> {
  const all = await getCollection('work');
  const en = all.filter((e) => e.id.startsWith('en/'));
  return en
    .map((e) => (lang === 'en' ? e : (all.find((x) => x.id === `zh/${slugOf(e)}`) ?? e)))
    .filter((e) => e.data.featured)
    .sort((a, b) => a.data.order - b.data.order);
}
```

- [ ] **Step 3: 四个内容文件**(正文用 `##` 小节,叙事固定为 问题→方案→结果;数字只写真实可证的,不编造)

`src/content/work/en/taxglobal-ai.md`:
```md
---
title: TaxGlobal AI
summary: A cent-accurate AI tax assistant — rules engine as the single source of truth, LLM as the interface.
role: Founder — architecture, product, review gates
stack: [Python, FastAPI, LangChain, Rules engine]
year: 2026
order: 1
---
## Problem
Tax software has zero tolerance for error: an answer that is off by one cent is a wrong answer. Most LLM products guess; a tax product must prove.

## My approach
I built the system so the LLM never computes. A rules-as-data engine owns every number; agents own the conversation; every pull request passes independent cent-accuracy review gates before it merges. Accuracy first, honest scope, escalate the hard cases.

## Outcome
A stateless, idempotent calculation core covering multi-state scenarios, verified to the cent on every change — and an architecture that scales from calculator to full agent stack without rewrites.
```

`src/content/work/zh/taxglobal-ai.md`(同 frontmatter 结构,中文正文,`## 问题 / ## 我的方案 / ## 结果`)。

`src/content/work/en/mithra-quest.md`:
```md
---
title: Mithra CRM Quest
summary: World #2 on a timed AI build challenge — deterministic numbers, gated LLM narrative, validator-feedback retries.
role: Solo builder
stack: [LLM orchestration, Incremental cache, Validators]
year: 2026
order: 2
---
## Problem
A timed, scored AI build challenge: produce a working CRM analytics product under the clock, judged on correctness.

## My approach
Deterministic code computes every number; the LLM only narrates around verified values. An incremental cache kept iterations fast, and validator feedback drove automatic retries until output passed.

## Outcome
Ranked #2 in the world on the challenge leaderboard (2026).
```

`src/content/work/zh/mithra-quest.md`(中文对应版)。

- [ ] **Step 4: build 验证 + Commit** `feat: work content collection with zh-fallback and two case studies`

---

### Task 4: 静态组件(Nav / WorkCard / Highlight / Footer)

**Files:**
- Create: `src/components/Nav.astro`, `src/components/WorkCard.astro`, `src/components/Highlight.astro`, `src/components/Footer.astro`

要点(每个组件含 scoped `<style>`,完整代码在组件内一次写成):
- **Nav**:fixed 顶栏,`rgba(250,246,238,.85)` + `backdrop-filter: blur(8px)`;左 "Shaw X"(小号静态 X svg);右 `Work`(锚到 `#work`)、`About`、GitHub/LinkedIn 内联 svg 图标(href 占位 `#`)、语言切换(`switchHref`)。
- **WorkCard**:props `{ title, summary, stack, href, index, lang }`;暖黑卡 `--card` 底、衬线标题、`>` 前缀等宽 summary、右上幽灵编号 `String(index).padStart(2,'0')`、等宽 tag 胶囊(边框 `--card-line`)、`hover` 上浮 4px + 边框泛 `--accent`;根元素带 `data-reveal` 供滚动动画。
- **Highlight**:暖黑全宽段,`#highlight`;`<span data-counter data-from="60" data-to="2">#2</span>` —— **初始文案就是终值 `#2`**(无 JS 也正确),JS 接管后才从 60 滚到 2;大号衬线 `clamp(64px, 12vw, 128px)`,副题等宽强调色。
- **Footer**:`#contact` 段(衬线大标题 + `mailto:hello@shawx.dev` 按钮)+ 底部一行 `footer.note` + 占位社交链接。

- [ ] **Step 1: 写四个组件**(按上述规格,样式与 spec §5 色板一致)
- [ ] **Step 2: build 验证 + Commit** `feat: nav, work card, highlight counter, footer components`

---

### Task 5: 粒子 X 引擎 + Hero

**Files:**
- Create: `src/scripts/particle-x.ts`, `src/components/Hero.astro`, `public/favicon.svg`

- [ ] **Step 1: `public/favicon.svg`**(静态切口 X,同时是无 canvas 回退形象):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34">
  <rect x="14.5" y="3" width="5" height="28" rx="1" fill="#2C2418" transform="rotate(45 17 17)"/>
  <rect x="14.5" y="3" width="5" height="11.5" rx="1" fill="#2C2418" transform="rotate(-45 17 17)"/>
  <rect x="14.5" y="19.5" width="5" height="11.5" rx="1" fill="#D85A30" transform="rotate(-45 17 17)"/>
</svg>
```

- [ ] **Step 2: `src/scripts/particle-x.ts`** — 接口与生命周期(spec §6):

```ts
export interface ParticleX { setProgress(p: number): void; destroy(): void; }
export function initParticleX(canvas: HTMLCanvasElement): ParticleX
```

实现要求(完整写在一个文件,≈170 行):
1. `prefers-reduced-motion` 或拿不到 2d context → 隐藏 canvas、给相邻 `.x-fallback`(静态 svg)加 `.show`,返回 no-op 对象。
2. DPR 缩放;粒子数:桌面 280 / `max-width:768px` 120;~15% 粒子用 `--accent` 色。
3. 目标点采样:两条对角线 ±4.5% 抖动(同 demo 算法);出生点:画布外随机环形。
4. 阶段:进站 1.2s 错落聚合(每粒子按索引延迟,easeInOut)→ 常态星云(sin/cos 噪声微漂移 + 距离 < 画布宽 10% 的近邻连线,线透明度随距离衰减)→ `setProgress(p)`(滚动驱动):粒子沿"home→径向飞出"插值,全局透明度 `1-p*.9`,p≥1 时跳过绘制。
5. 鼠标 `pointermove` 半径 30px 推开,移开归位(弹簧式回弹:位置向目标 lerp 0.08)。
6. fps 守护:滚动平均帧耗 > 25ms 持续 60 帧 → 粒子数减半重建(只降一次)。
7. `document.hidden` 时暂停 rAF;`destroy()` 移除监听。

- [ ] **Step 3: `src/components/Hero.astro`**:

```astro
---
import { t, type Lang } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
---
<section id="hero" class="hero">
  <div class="container hero-inner">
    <div class="hero-name" data-hero-name>
      <h1 class="hero-title">Shaw<span class="sr-only"> X</span></h1>
      <div class="x-wrap">
        <canvas class="x-canvas" data-particle-x aria-hidden="true"></canvas>
        <img class="x-fallback" src="/favicon.svg" alt="" aria-hidden="true" />
      </div>
    </div>
    <p class="tagline mono" data-hero-sub>{t(lang, 'hero.tagline')}</p>
    <p class="intro" data-hero-sub>{t(lang, 'hero.intro')}</p>
  </div>
  <p class="scroll-hint mono" data-hero-sub>{t(lang, 'hero.scroll')} ↓</p>
</section>
```
样式要点:`.hero` 100vh flex 居中;`.hero-title` `clamp(56px, 9vw, 120px)`;`.x-canvas` 正方形 `clamp(120px, 14vw, 200px)`,与标题基线对齐;`.x-fallback` 默认 `display:none`,`.show` 时显示;`.scroll-hint` 底部居中。

- [ ] **Step 4: build 验证 + Commit** `feat: particle X engine (assemble/nebula/scatter) and hero`

---

### Task 6: 滚动编排(Lenis + GSAP)

**Files:**
- Create: `src/scripts/scroll-fx.ts`

- [ ] **Step 1: `src/scripts/scroll-fx.ts`** — 唯一动效入口 `initSite()`(spec §7 编排表):

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initParticleX } from './particle-x';
```

实现要求:
1. 先 `initParticleX`(它自己处理 reduced-motion)。
2. `prefers-reduced-motion: reduce` → 直接 return(内容默认全部可见,零动画)。
3. Lenis(`lerp: 0.12`)接 `gsap.ticker`,`lenis.on('scroll', ScrollTrigger.update)`,`gsap.ticker.lagSmoothing(0)`。
4. `gsap.matchMedia()`:
   - `(min-width: 769px)`:hero `pin: true, scrub: true, end: '+=120%'`;时间线:`[data-hero-name]` scale→2.6(transformOrigin left center)、`[data-hero-sub]` 渐隐上移;`onUpdate: self => px.setProgress(self.progress)`(粒子同步散开)。
   - `(max-width: 768px)`:不 pin;hero 元素轻量渐隐,粒子 `setProgress` 仍接滚动(trigger hero, scrub)。
5. 通用(两端):`#work [data-reveal]` 进入视口 88% 时 `y:48, opacity:0 → 0` 错落(`power3.out`);counter `{v:60}→{v:2}` scrub 驱动 `textContent = '#'+Math.round(v)`,`.big-num` 同步 scale 0.6→1;`#contact .contact-inner` 渐显上滑。
6. 导出 `initSite`,页面里 `<script>import {initSite} from '...'; initSite();</script>`。

- [ ] **Step 2: build 验证 + Commit** `feat: lenis + scrolltrigger orchestration with degradations`

---

### Task 7: 页面组装(en + zh 全部路由)

**Files:**
- Create: `src/pages/index.astro`(重写占位)、`src/pages/about.astro`、`src/pages/work/[slug].astro`、`src/pages/404.astro`
- Create: `src/pages/zh/index.astro`、`src/pages/zh/about.astro`、`src/pages/zh/work/[slug].astro`

- [ ] **Step 1: 首页**(en 版;zh 版同结构、`lang="zh"`、`getWork('zh')`):

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import WorkCard from '../components/WorkCard.astro';
import Highlight from '../components/Highlight.astro';
import Footer from '../components/Footer.astro';
import { getWork, slugOf } from '../lib/work';
import { t } from '../i18n/ui';
const lang = 'en' as const;
const work = await getWork(lang);
---
<Base lang={lang} title="Shaw X — engineer with taste" description={t(lang, 'hero.intro')}>
  <Nav lang={lang} />
  <Hero lang={lang} />
  <section id="work" class="container">
    <p class="section-label">{t(lang, 'work.label')} <span class="idx">/01</span></p>
    <div class="work-grid">
      {work.map((e, i) => (
        <WorkCard title={e.data.title} summary={e.data.summary} stack={e.data.stack}
          href={`/work/${slugOf(e)}/`} index={i + 1} lang={lang} />
      ))}
    </div>
  </section>
  <Highlight lang={lang} />
  <Footer lang={lang} />
  <script>
    import { initSite } from '../scripts/scroll-fx';
    initSite();
  </script>
</Base>
```
(zh 版 href 前缀 `/zh/work/...`;work-grid:`grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;`,样式放 index 内 `<style>` 或 global.css。)

- [ ] **Step 2: 项目详情页** `src/pages/work/[slug].astro`:

```astro
---
import { render } from 'astro:content';
import Base from '../../layouts/Base.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
import { getWork, slugOf } from '../../lib/work';
import { t, homeOf } from '../../i18n/ui';

export async function getStaticPaths() {
  const entries = await getWork('en');
  return entries.map((e) => ({ params: { slug: slugOf(e) }, props: { entry: e } }));
}
const lang = 'en' as const;
const { entry } = Astro.props;
const { Content } = await render(entry);
---
<Base lang={lang} title={`${entry.data.title} — Shaw X`} description={entry.data.summary}>
  <Nav lang={lang} />
  <main class="container case">
    <a class="mono back" href={`${homeOf(lang)}#work`}>{t(lang, 'case.back')}</a>
    <h1>{entry.data.title}</h1>
    <p class="case-summary mono">{entry.data.summary}</p>
    <dl class="case-meta mono">
      <div><dt>{t(lang, 'case.role')}</dt><dd>{entry.data.role}</dd></div>
      <div><dt>{t(lang, 'case.stack')}</dt><dd>{entry.data.stack.join(' · ')}</dd></div>
      <div><dt>{t(lang, 'case.year')}</dt><dd>{entry.data.year}</dd></div>
    </dl>
    <article class="prose"><Content /></article>
  </main>
  <Footer lang={lang} />
</Base>
```
zh 版:`getWork('zh')`(回退已在 lib 处理)、路径 `/zh/work/[slug]`。`.prose h2` 用 section-label 风格;详情页不挂滚动动效(YAGNI)。

- [ ] **Step 3: About 两版**(占位照片色块 + 经历/技能小节,内容からspec §3;中英各一)与 **404**(静态 X + `notfound.*` 文案 + 回首页链接)。

- [ ] **Step 4: build + Commit** `feat: assemble all pages for en and zh routes`

---

### Task 8: README + 验收待填清单

**Files:**
- Create: `README.md`

- [ ] **Step 1:** 快速开始(`npm install` / `npm run dev` → `http://localhost:4321`)、项目结构、**「验收待填清单」**:正式域名、`site` 配置、邮箱、GitHub/LinkedIn 链接、About 照片、TaxGlobal AI 公开程度复核、tagline 措辞确认。
- [ ] **Step 2: Commit** `docs: readme with quickstart and acceptance checklist`

---

### Task 9: 浏览器实测验收(硬门)

- [ ] **Step 1:** `npm run build` 零错误;`npm run preview` 起本地服务。
- [ ] **Step 2:** Claude Preview 打开 `http://localhost:4321`:
  - 桌面 1280px 截图:hero(粒子 X 聚合完成态)、滚动后 work 卡片、highlight 数字、footer
  - 滚动行为:hero pin + 名字放大、卡片错落入场、counter 滚动(用 eval 滚动页面分段截图)
  - 移动 390px 截图:无 pin、布局不破
  - 链接走查:EN↔中 切换往返、Work 锚点、案例页两语言、About、404、mailto
- [ ] **Step 3:** 控制台零报错(preview console logs);发现问题修复并重测。
- [ ] **Step 4:** 最终 Commit `chore: verified local acceptance pass`,向 Shaw 汇报验收(截图 + 已知占位清单 + 如何本地跑)。

---

## Self-Review 记录

- **Spec 覆盖**:§3 路由(Task 7)、§4 内容模型+回退(Task 3)、§5 视觉(Task 2/4)、§6 粒子(Task 5)、§7 动效+降级(Task 6)、§9 验收(Task 9)、§10 边界(404=Task 7,图片占位=About 色块,canvas 回退=Task 5)、§11 素材(Task 8 清单)。OG image 二进制素材依赖照片/品牌图,归入 §11 待填,不阻塞验收。
- **占位符扫描**:仅「验收待填清单」内为有意占位,其余步骤均有具体代码/规格。
- **类型一致性**:`Lang`/`UiKey`(Task 2)被 Task 3-7 引用;`initParticleX` 返回 `ParticleX`(Task 5)与 Task 6 `setProgress` 调用一致;`getWork/slugOf`(Task 3)与 Task 7 一致。
