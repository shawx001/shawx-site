/**
 * 粒子 X 字标引擎 v2 — Gemini 风格:彩色渐变光点、柔光晕、流动漂移、闪烁。
 * 生命周期:进站错落聚合(~1.4s)→ 星云常态(缓慢流动 + 微轨道 + 鼠标拨弄)
 * → setProgress(p) 由滚动驱动径向散开。
 * 降级:prefers-reduced-motion / 无 2d context → 显示静态 .x-fallback。
 */

export interface ParticleX {
  setProgress(p: number): void;
  destroy(): void;
}

interface Particle {
  hx: number; hy: number; // 目标点(X 形)
  sx: number; sy: number; // 出生点(画布外环形)
  ox: number; oy: number; // 散开目标(径向外)
  x: number; y: number;   // 当前位置
  r: number;
  sprite: number;
  phase: number;
  swirl: number;          // 微轨道半径
  twinkle: number;        // 闪烁速度
  delay: number;
}

const noop: ParticleX = { setProgress() {}, destroy() {} };

// Gemini 式光谱:蓝 → 靛 → 紫 → 玫 → 珊瑚(与暖底色衔接)
const PALETTE = ['#4796E3', '#5F7FE8', '#8E64D8', '#B65CC9', '#D85A8A', '#E0705A'];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function ease(t: number): number {
  const c = Math.min(Math.max(t, 0), 1);
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
}

function makeSprite(color: string): HTMLCanvasElement {
  const s = document.createElement('canvas');
  s.width = 64;
  s.height = 64;
  const c = s.getContext('2d')!;
  const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, color);
  g.addColorStop(0.3, color + 'B3');
  g.addColorStop(1, color + '00');
  c.fillStyle = g;
  c.fillRect(0, 0, 64, 64);
  return s;
}

export function initParticleX(canvas: HTMLCanvasElement): ParticleX {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  if (reduced || !ctx) {
    canvas.style.display = 'none';
    canvas.parentElement?.querySelector('.x-fallback')?.classList.add('show');
    return noop;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const size = canvas.clientWidth || 200;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  const sprites = PALETTE.map(makeSprite);
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  let count = isMobile ? 110 : 240;

  function makeParticles(n: number): Particle[] {
    const arr: Particle[] = [];
    const m = size * 0.21;
    for (let i = 0; i < n; i++) {
      const diag = Math.random() < 0.5;
      const t = Math.random();
      const jx = (Math.random() - 0.5) * size * 0.085;
      const jy = (Math.random() - 0.5) * size * 0.085;
      const hx = (diag ? lerp(m, size - m, t) : lerp(size - m, m, t)) + jx;
      const hy = lerp(m, size - m, t) + jy;
      const ang = Math.random() * Math.PI * 2;
      const rad = size * (0.75 + Math.random() * 0.5);
      const oang = Math.atan2(hy - size / 2, hx - size / 2) + (Math.random() - 0.5) * 0.9;
      const orad = size * (0.7 + Math.random() * 0.7);
      // 偏蓝紫取色,少量珊瑚;8% 是大光斑
      const ci = Math.floor(Math.pow(Math.random(), 1.3) * PALETTE.length);
      const big = Math.random() < 0.08;
      arr.push({
        hx, hy,
        sx: size / 2 + Math.cos(ang) * rad,
        sy: size / 2 + Math.sin(ang) * rad,
        ox: size / 2 + Math.cos(oang) * orad,
        oy: size / 2 + Math.sin(oang) * orad,
        x: size / 2 + Math.cos(ang) * rad,
        y: size / 2 + Math.sin(ang) * rad,
        r: big ? 3.2 + Math.random() * 1.8 : 1.1 + Math.random() * 1.7,
        sprite: ci,
        phase: Math.random() * Math.PI * 2,
        swirl: 1.5 + Math.random() * 3.5,
        twinkle: 0.8 + Math.random() * 2.2,
        delay: (i % 24) * 0.022,
      });
    }
    return arr;
  }

  let particles = makeParticles(count);
  let scatter = 0;
  let rafId = 0;
  const startTime = performance.now();
  const mouse = { x: -9999, y: -9999 };

  const onMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * size;
    mouse.y = ((e.clientY - rect.top) / rect.height) * size;
  };
  const onLeave = () => {
    mouse.x = -9999;
    mouse.y = -9999;
  };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);

  let lastT = 0;
  let slowFrames = 0;
  let degraded = false;
  const REPEL = size * 0.15;

  function tick(now: number) {
    rafId = requestAnimationFrame(tick);
    if (document.hidden) return;

    const dt = now - lastT;
    lastT = now;
    if (!degraded && dt > 25 && dt < 200) {
      slowFrames++;
      if (slowFrames > 60) {
        degraded = true;
        count = Math.floor(count / 2);
        particles = particles.filter((_, i) => i % 2 === 0);
      }
    } else if (dt <= 25) {
      slowFrames = 0;
    }

    ctx!.clearRect(0, 0, size, size);
    if (scatter >= 1) return;

    const elapsed = (now - startTime) / 1000;
    const globalFade = 1 - scatter * 0.9;
    const sEase = ease(scatter);

    for (const p of particles) {
      const af = ease((elapsed - p.delay) / 1.4);
      // 缓慢流动 + 微轨道(Gemini 式漂浮)
      const dx =
        Math.sin(elapsed * 0.42 + p.phase) * size * 0.022 +
        Math.cos(elapsed * (0.5 + p.twinkle * 0.1) + p.phase) * p.swirl;
      const dy =
        Math.cos(elapsed * 0.38 + p.phase * 1.3) * size * 0.022 +
        Math.sin(elapsed * (0.46 + p.twinkle * 0.08) + p.phase) * p.swirl;
      let tx = lerp(p.sx, p.hx + dx * af, af);
      let ty = lerp(p.sy, p.hy + dy * af, af);
      tx = lerp(tx, p.ox, sEase);
      ty = lerp(ty, p.oy, sEase);

      const mdx = tx - mouse.x;
      const mdy = ty - mouse.y;
      const md2 = mdx * mdx + mdy * mdy;
      if (md2 < REPEL * REPEL && md2 > 0.01) {
        const md = Math.sqrt(md2);
        const f = ((REPEL - md) / REPEL) * size * 0.12;
        tx += (mdx / md) * f;
        ty += (mdy / md) * f;
      }

      p.x += (tx - p.x) * 0.12;
      p.y += (ty - p.y) * 0.12;

      // 柔光 sprite + 闪烁
      const tw = 0.72 + 0.28 * Math.sin(elapsed * p.twinkle + p.phase * 2);
      const d = p.r * 4.4;
      ctx!.globalAlpha = 0.9 * tw * globalFade * Math.min(af + 0.15, 1);
      ctx!.drawImage(sprites[p.sprite], p.x - d / 2, p.y - d / 2, d, d);
    }
    ctx!.globalAlpha = 1;
  }

  rafId = requestAnimationFrame(tick);

  return {
    setProgress(p: number) {
      scatter = Math.min(Math.max(p, 0), 1);
    },
    destroy() {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    },
  };
}
