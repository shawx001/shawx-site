/**
 * 滚动编排(spec §7):Lenis 平滑滚动 + GSAP ScrollTrigger。
 * 桌面:hero 钉住放大 + 粒子散开;移动端:不 pin,轻量渐隐。
 * prefers-reduced-motion:零动画直接返回(内容默认全部可见)。
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initParticleX, type ParticleX } from './particle-x';

export function initSite(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-particle-x]');
  const px: ParticleX | null = canvas ? initParticleX(canvas) : null;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const mm = gsap.matchMedia();

  mm.add('(min-width: 769px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '+=120%',
        scrub: true,
        pin: true,
        onUpdate: (self) => px?.setProgress(self.progress),
      },
    });
    tl.to('[data-hero-name]', {
      scale: 2.2,
      yPercent: -10,
      transformOrigin: 'center center',
      ease: 'power2.in',
    }, 0).to('[data-hero-sub]', { opacity: 0, y: -30 }, 0);
  });

  mm.add('(max-width: 768px)', () => {
    gsap.to('[data-hero-sub]', {
      opacity: 0,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: '60% top', scrub: true },
    });
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => px?.setProgress(self.progress),
    });
  });

  gsap.utils.toArray<HTMLElement>('#work [data-reveal]').forEach((el, i) => {
    gsap.from(el, {
      y: 48,
      opacity: 0,
      duration: 0.7,
      delay: (i % 3) * 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  const counter = document.querySelector<HTMLElement>('[data-counter]');
  if (counter) {
    const from = Number(counter.dataset.from ?? 60);
    const to = Number(counter.dataset.to ?? 2);
    const obj = { v: from };
    gsap.fromTo(obj, { v: from }, {
      v: to,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#highlight', start: 'top 75%', end: 'center center', scrub: true },
      onUpdate: () => {
        counter.textContent = `#${Math.round(obj.v)}`;
      },
    });
    gsap.from('.big-num', {
      scale: 0.6,
      scrollTrigger: { trigger: '#highlight', start: 'top 80%', end: 'center center', scrub: true },
    });
  }

  gsap.from('#contact .contact-inner', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#contact', start: 'top 85%' },
  });
}
