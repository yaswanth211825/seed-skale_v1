// Motion system. Primitives are driven by markup, so pages need no extra code:
//   h1 / .section-head h2 / [data-split]   line-by-line masked headline reveal
//   [data-parallax="0.2"]                   element drifts against the scroll (0.05–0.3)
//   .btn-primary, .btn-dark, [data-magnetic] button leans toward the cursor
//   [data-tilt-card], .tile, .card-link, .service, .post   card tilts under the cursor
//   .panel, .cta-band                       rounded sections grow into place as they enter
// GSAP and Lenis load only when motion is allowed. Without JS, everything is simply visible.

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Read the shared motion tokens from CSS so JS and CSS stay in sync.
const css = getComputedStyle(document.documentElement);
const ms = (name: string, fallback: number) => parseFloat(css.getPropertyValue(name)) || fallback;
const DUR_2 = ms('--dur-2', 600) / 1000;
const DUR_3 = ms('--dur-3', 1200) / 1000;
const STAGGER = ms('--stagger', 80) / 1000;
const EASE = 'expo.out';

async function start() {
  if (reduced) return;

  const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/SplitText'),
  ]);
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: EASE, duration: DUR_2 });

  /* Smooth scroll on desktop only; phones keep native momentum scrolling. */
  if (finePointer) {
    const { default: Lenis } = await import('lenis');
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    // In-page anchor links scroll smoothly too, offset for the floating header.
    document.addEventListener('click', (e) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      const target = document.querySelector(a.getAttribute('href')!);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    });
  }

  /* Headline line reveal */
  const headlines = Array.from(
    document.querySelectorAll<HTMLElement>('main h1, main .section-head h2, main [data-split]'),
  ).filter((el) => !el.querySelector('svg') && !el.closest('[data-no-split]'));
  await document.fonts?.ready;
  headlines.forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: DUR_2 * 1.4,
          stagger: STAGGER,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });

  /* Parallax layers */
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = Math.min(0.3, Math.max(0.05, Number(el.dataset.parallax) || 0.15));
    gsap.fromTo(
      el,
      { yPercent: speed * 60 },
      {
        yPercent: speed * -60,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  /* Rounded sections grow into place: layered depth as you scroll */
  document.querySelectorAll<HTMLElement>('.panel, .cta-band').forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 0.95, y: 30 },
      {
        scale: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 55%', scrub: true },
      },
    );
  });

  if (!finePointer) {
    ScrollTrigger.refresh();
    return;
  }

  /* Magnetic buttons (max 8px pull) */
  document.querySelectorAll<HTMLElement>('.btn-primary, .btn-dark, [data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x(((e.clientX - r.left) / r.width - 0.5) * 16);
      y(((e.clientY - r.top) / r.height - 0.5) * 12);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });

  /* Tilt cards (max 6°) */
  document
    .querySelectorAll<HTMLElement>('[data-tilt-card], .tile, .card-link, .service, .post')
    .forEach((el) => {
      el.classList.add('is-tilt');
      gsap.set(el, { transformPerspective: 900 });
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      const lift = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 6);
        rx(((e.clientY - r.top) / r.height - 0.5) * -6);
        lift(-4);
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); lift(0); });
    });

  ScrollTrigger.refresh();
  void DUR_3;
}

start();
