// Site-wide interactions: scroll reveals, counters, scroll progress.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

/* Scroll reveals: [data-reveal] fades and rises in once. Children of [data-stagger] get a delay. */
document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
  Array.from(group.children).forEach((child, i) => {
    (child as HTMLElement).dataset.reveal ??= '';
    (child as HTMLElement).style.setProperty('--i', String(i));
  });
});

const revealed = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealed.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  revealed.forEach((el) => io.observe(el));
}

/* Counters: <span data-count="300" data-prefix="+" data-suffix="%"> */
const counters = document.querySelectorAll<HTMLElement>('[data-count]');
const format = (el: HTMLElement, n: number) => {
  el.textContent = `${el.dataset.prefix ?? ''}${Math.round(n).toLocaleString('en-IN')}${el.dataset.suffix ?? ''}`;
};
const runCounter = (el: HTMLElement) => {
  const target = Number(el.dataset.count);
  if (reduceMotion) return format(el, target);
  const start = performance.now();
  const duration = 1400;
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    format(el, target * (1 - Math.pow(1 - t, 4)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if ('IntersectionObserver' in window) {
  const co = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target as HTMLElement);
        co.unobserve(entry.target);
      });
    },
    { threshold: 0.6 },
  );
  counters.forEach((el) => co.observe(el));
} else {
  counters.forEach((el) => format(el, Number(el.dataset.count)));
}

/* Scroll progress bar at the top of the page */
const bar = document.createElement('div');
bar.className = 'scroll-progress';
bar.setAttribute('aria-hidden', 'true');
document.body.append(bar);
const setProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
};
setProgress();
window.addEventListener('scroll', setProgress, { passive: true });
window.addEventListener('resize', setProgress);

/* Decorative loops start on the first interaction and pause while off-screen. */
const startLoops = () => document.documentElement.classList.add('motion-on');
['pointermove', 'pointerdown', 'scroll', 'keydown', 'touchstart'].forEach((ev) =>
  window.addEventListener(ev, startLoops, { once: true, passive: true }),
);
if ('IntersectionObserver' in window) {
  const loopIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.target as HTMLElement).toggleAttribute('data-paused', !e.isIntersecting));
  });
  document.querySelectorAll<HTMLElement>('[data-loop]').forEach((el) => loopIO.observe(el));
}
