# Shaw X 个人网站 — 设计文档

- **日期**:2026-06-10
- **状态**:设计已批准,待实现规划
- **参考**:sangyuxi.com(极简作品集范式,仅借鉴结构,视觉/动效走独立路线)

## 1. 背景与目标

求职用个人作品集网站。目标读者是招聘方/面试官(中英双语受众)。

成功标准:
1. 打开 10 秒内能记住两件事:"Shaw X 这个人"(粒子 X + 名字)和"他做过什么硬东西"(项目 + 数字)。
2. 网站本身就是作品 —— 动效、审美、性能共同证明"有审美、有 product sense 的独立工程师"这句定位。
3. 以后每做完一个新项目,10 分钟内就能加上去(写一个 Markdown 文件)。

## 2. 定位与文案基调

一句话定位(首页 Hero,中英两版,最终文案实现时定稿):
> diverse、有审美、有 product sense 的独立工程师 / An independent engineer with taste and product sense.

基调:克制、自信、用数字说话;科技感来自动效与等宽字体细节,不靠堆术语。

## 3. 信息架构

```
/            英文首页(默认)
/zh/         中文首页(与英文一一对应)
/work/<slug>          项目详情页(英)
/zh/work/<slug>       项目详情页(中)
/about/  /zh/about/   关于页
/404                  自定义 404
```

- 导航:`Work · About` + GitHub / LinkedIn 图标 + 语言切换(EN/中),右上角,全站固定。
- 首页区块顺序:**Hero(粒子 X + 名字 + 定位)→ Selected Work(项目卡片)→ Highlight(亮点数字条)→ Contact footer**。
- 项目详情页叙事结构固定为:**问题 → 我的方案 → 结果(可量化数字)**,另含角色、技术栈、年份、封面图。
- About:照片 + 经历时间线 + 技能 + 一小节兴趣/审美侧面。

## 4. 内容模型

- Astro Content Collections:
  ```
  src/content/work/en/<slug>.md
  src/content/work/zh/<slug>.md
  ```
- frontmatter 字段:`title, summary, role, stack[], year, cover, featured, order`。
- 界面文案(导航、按钮、区块标题)集中于 `src/i18n/ui.ts` 双语字典,改一处全站生效。
- **回退规则**:中文版项目文件缺失时,中文站该项目自动展示英文内容(不留空、不报错)。
- 初始内容:
  - 项目:TaxGlobal AI(公开程度待 Shaw 确认后定文案)。
  - 亮点数字:Mithra CRM Quest 全球第 2(2026-06)。
  - 后续 vibe coding / side projects 持续追加。

## 5. 视觉系统

| 角色 | 值 |
|---|---|
| 页面底色 | `#FAF6EE` 象牙白 |
| 主文字 | `#2C2418` 深棕黑 |
| 次级文字 | `#6F6353` |
| 强调色 | `#D85A30` 赤陶橙(全站唯一强调色) |
| 卡片底色 | `#241E17` 暖黑 |

- 字体:标题衬线(Fraunces 或同类);正文 Inter + Noto Sans SC(中文不发虚);科技细节(编号、标签、tagline)用等宽字体(JetBrains Mono 或同类)。
- Work 卡片:暖黑底、等宽字体描述行(`>` 前缀)、右上大号幽灵编号(01/02…)、hover 抬升 + 边缘微光强调色。
- 区块标题样式:`SELECTED WORK /01` 等宽大写 + 强调色编号。
- 大量留白,单强调色纪律:橙色只用于强调,不超过版面 5%。

## 6. 粒子 X 字标(全站记忆点)

生命周期三段:

1. **聚合(进站一次)**:数百颗粒子从四面八方飞入聚成 X,粒子带延迟错落,约 1.2s 完成。
2. **星云常态**:粒子围绕 X 形漂浮(噪声驱动微位移)+ 近邻粒子间星座连线;鼠标靠近时粒子被拨开,移开后归位。
3. **滚动散开**:页面下滚时粒子散开退场,让位给内容;回滚到顶时重新聚合。

实现规格:
- 原生 Canvas 2D,**不引入 three.js 等重型库**。
- 粒子数上限:桌面 ≤ 300,移动 ≤ 120;粒子配色 = 深棕黑为主 + ~15% 强调色。
- 帧率守护:监测到持续低于 40fps 自动减半粒子数。
- 静态简化版 X(几何切口形)用于:favicon、OG 分享图、无 JS / 不支持 canvas 时的回退显示。

## 7. 动效系统

- **Lenis** 惯性平滑滚动 + **GSAP ScrollTrigger** 驱动全部滚动动画。
- 编排表(桌面):

| 滚动段 | 效果 |
|---|---|
| Hero | 名字钉住(pin)并随滚动放大至撑满视口,粒子 X 同步散开,然后放行 |
| Selected Work | 区块整体推进入场,卡片依次错落上滑(stagger) |
| Highlight | 排名数字从 #60 滚动到 #2,同时缩放放大入场 |
| Footer | 推入收尾,邮箱按钮渐显 |

- **降级策略**:
  - 移动端:取消 pin/放大,保留轻量渐显与 stagger;粒子减量。
  - `prefers-reduced-motion`:全部动效替换为简单淡入,粒子 X 显示静态版。
  - 无 JS:内容完整可读,动效与粒子均为增强层(渐进增强)。

## 8. 技术栈与部署

- **Astro(最新稳定版)+ TypeScript + 内置 i18n 路由 + Content Collections**;动效层 GSAP + Lenis;粒子原生 canvas。不用 React/Vue,不用 CMS。
- 仓库:`C:\Users\shawx\Desktop\shawx-site`(独立仓库,与 Tax Global AI 完全分离)→ 推 GitHub → Vercel 自动部署。
- 域名:Shaw 自购名字域名(待定),Vercel 绑定;绑定前用 `*.vercel.app` 预览。
- 目录草图:

```
shawx-site/
├─ docs/specs/                 设计文档(本文件)
├─ src/
│  ├─ components/              Nav, Hero, ParticleX, WorkCard, Highlight, Footer…
│  ├─ content/work/{en,zh}/    项目 Markdown
│  ├─ i18n/ui.ts               双语界面文案字典
│  ├─ layouts/
│  ├─ pages/                   index, about, work/[slug], 404 + zh/ 镜像
│  └─ scripts/                 particle-x.ts, scroll-fx.ts
└─ public/                     favicon, OG image, 照片
```

## 9. 质量门槛(验收标准)

- Lighthouse(移动端):Performance ≥ 90,Accessibility ≥ 95,SEO ≥ 95。
- 中英两版页面一一对应,语言切换在任意页面停留原位切换。
- 375px 宽移动端走查通过;键盘可导航;图片懒加载 + 尺寸占位(无布局跳动)。
- `prefers-reduced-motion` 与无 JS 两种模式下内容完整可用。
- 每个项目页有 OG 标签(分享到微信/LinkedIn 有封面卡片)。

## 10. 边界与错误处理

| 情况 | 行为 |
|---|---|
| 项目封面图缺失 | 显示暖黑底 + 幽灵编号占位卡 |
| 中文内容缺失 | 回退英文内容 |
| canvas 不支持 / 无 JS | 静态 X + 内容正常展示 |
| 路径不存在 | 自定义 404(带返回首页和粒子小彩蛋) |

## 11. 需要 Shaw 提供的素材(实现期收集)

- [ ] 名字正式拼写(站内显示 "Shaw X",域名待定)与想买的域名
- [ ] 邮箱 / GitHub / LinkedIn 链接
- [ ] About 用照片一张
- [ ] TaxGlobal AI 可公开到什么程度(截图?数字?代码链接?)
- [ ] 中英 tagline 是否有自己想要的措辞

## 12. 范围外(YAGNI,以后再说)

博客、评论系统、CMS 后台、深色模式、WebGL/3D、多于两种语言、访客统计后台。
