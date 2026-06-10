/**
 * 粒子 X 字标引擎(spec §6)。
 * 生命周期:进站错落聚合(~1.2s)→ 星云常态(噪声漂移 + 近邻连线 + 鼠标拨弄)
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
  accent: boolean;
  phase: number;
  delay: number;
}

const noop: ParticleX = { setProgress() {}, destroy() {} };

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function ease(t: number): number {
  const c = Math.min(Math.max(t, 0), 1);
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
}

export function initParticleX(canvas: HTMLCanvasElement): ParticleX {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  if (reduced || !ctx) {
    canvas.style.display = 'none';
    canvas.parentElement?.querySelector('.x-fallback')?.classList.add('show');
    return noop;
  }

  const INK = '#2C2418';
  const ACCENT = '#D85A30';
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const size = canvas.clientWidth || 200;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  let count = isMobile ? 120 : 280;

  function makeParticles(n: number): Particle[] {
    const arr: Particle[] = [];
    const m = size * 0.21; // X 形在画布内的边距
    for (let i = 0; i < n; i++) {
      const diag = Math.random() < 0.5;
      const t = Math.random();
      const jx = (Math.random() - 0.5) * size * 0.09;
      const jy = (Math.random() - 0.5) * size * 0.09;
      const hx = (diag ? lerp(m, size - m, t) : lerp(size - m, m, t)) + jx;
      const hy = lerp(m, size - m, t) + jy;
      const ang = Math.random() * Math.PI * 2;
      const rad = size * (0.75 + Math.random() * 0.5);
      const oang = Math.atan2(hy - size / 2, hx - size / 2) + (Math.random() - 0.5) * 0.9;
      const orad = size * (0.7 + Math.random() * 0.7);
      arr.push({
        hx, hy,
        sx: size / 2 + Math.cos(ang) * rad,
        sy: size / 2 + Math.sin(ang) * rad,
        ox: size / 2 + Math.cos(oang) * orad,
        oy: size / 2 + Math.sin(oang) * orad,
        x: size / 2 + Math.cos(ang) * rad,
        y: size / 2 + Math.sin(ang) * rad,
        r: 1.1 + Math.random() * 1.5,
        accent: Math.random() < 0.15,
        phase: Math.random() * Math.PI * 2,
        delay: (i % 20) * 0.02,
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

  // fps 守护:持续慢帧则粒子数减半(只降一次)
  let lastT = 0;
  let slowFrames = 0;
  let degraded = false;

  const LINK = size * 0.1;
  const LINK2 = LINK * LINK;
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
      const af = ease((elapsed - p.delay) / 1.2);
      const dx =
        Math.sin(elapsed * 0.9 + p.phase) * size * 0.018 +
        Math.cos(elapsed * 0.6 + p.phase * 2) * size * 0.012;
      const dy =
        Math.cos(elapsed * 0.8 + p.phase) * size * 0.018 +
        Math.sin(elapsed * 0.5 + p.phase * 1.7) * size * 0.012;
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

      p.x += (tx - p.x) * 0.14;
      p.y += (ty - p.y) * 0.14;
    }

    if (elapsed > 1.4 && scatter < 0.3) {
      ctx!.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        let links = 0;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const ddx = a.x - b.x;
          const ddy = a.y - b.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < LINK2) {
            ctx!.globalAlpha = (1 - d2 / LINK2) * 0.18 * globalFade;
            ctx!.strokeStyle = INK;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
            if (++links >= 3) break;
          }
        }
      }
    }

    for (const p of particles) {
      ctx!.globalAlpha = 0.92 * globalFade;
      ctx!.fillStyle = p.accent ? ACCENT : INK;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx!.fill();
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
