# Shaw X — 个人作品集网站

象牙白编辑感 × 粒子 X 字标 × 滚动叙事。Astro 静态站,英文默认 + `/zh/` 中文镜像。

## 快速开始

```powershell
npm install
npm run dev      # http://localhost:4321
npm run build    # 产出 dist/
npm run preview  # 本地预览构建产物
```

> Node 已安装在 `C:\Users\shawx\tools\node`(已加入用户 PATH;新开的终端直接可用)。

## 结构

```
src/
├─ components/        Nav / Hero / WorkCard / Highlight / Footer
├─ content/work/      项目 = Markdown(en/ 与 zh/ 同名成对;zh 缺失自动回退 en)
├─ i18n/ui.ts         全站双语界面文案字典
├─ layouts/Base.astro 头部 meta / 字体 / 全局样式
├─ pages/             en 路由 + zh/ 镜像 + 404
└─ scripts/           particle-x.ts(粒子 X)/ scroll-fx.ts(滚动编排)
docs/
├─ specs/             设计文档(已批准)
└─ plans/             实现计划
```

## 以后怎么加新项目

1. 复制 `src/content/work/en/taxglobal-ai.md` 改成新项目(英文版),`order` 控制排序;
2. 写对应的 `src/content/work/zh/<同名>.md`(不写也行,会自动回退英文);
3. `git commit` —— 首页卡片和详情页自动生成。

## 验收待填清单(占位 → 真实)

- [ ] **域名**:购买后改 `astro.config.mjs` 里的 `site`
- [ ] **邮箱**:`src/components/Footer.astro` 里的 `mailto:hello@shawx.dev`
- [ ] **GitHub / LinkedIn 链接**:`src/components/Nav.astro` 里的两个 `href="#"`
- [ ] **About 照片**:`src/pages/about.astro` 与 `zh/about.astro` 的 photo 占位块
- [ ] **TaxGlobal AI 公开程度**:复核 `src/content/work/{en,zh}/taxglobal-ai.md` 文案
- [ ] **Tagline 措辞**:`src/i18n/ui.ts` 里 `hero.tagline` / `hero.intro`
- [ ] **OG 分享图**:有照片/品牌图后加 `og:image`

## 动效说明

- 滚轮 = 惯性平滑滚动(Lenis);首屏名字钉住放大,粒子 X 同步散开(GSAP ScrollTrigger)
- 粒子 X:进站聚合 → 星云漂浮 + 近邻连线,鼠标靠近会被拨开 → 滚动散开
- 移动端自动降级(不 pin、粒子减半);系统开了"减弱动态效果"则全部静态;无 JS 内容完整可读
