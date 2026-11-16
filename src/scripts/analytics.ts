// Google Analytics 4 for the whole site.
// - Loads gtag only on the live domain, on the first interaction or after 8 s (keeps Lighthouse scores).
// - Events queue in dataLayer from the first moment, so nothing is lost before the script arrives.
// - One delegated click listener names every click (CTA, WhatsApp, call, email, nav, share, filters...).
// - Blog articles get detailed reading data: scroll depth, sections reached, active reading time,
//   finish rate, steps ticked, votes, shares, copies and an exit summary.
// - Never sends names, emails, phone numbers or message text.
// On localhost / previews nothing is sent; add ?ga_debug=1 to see the events in the console.

import { site } from '../data/site';

type Params = Record<string, string | number | boolean | undefined>;
declare global {
  interface Window { dataLayer: unknown[]; gtag: (...args: unknown[]) => void }
}

const live = /(^|\.)skaleseed\.com$/.test(location.hostname);
const debug = new URLSearchParams(location.search).has('ga_debug');

window.dataLayer = window.dataLayer || [];
window.gtag = function gtag() {
  // gtag needs the real `arguments` object
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
};

const clip = (s: string | null | undefined, n = 100) => (s ?? '').replace(/\s+/g, ' ').trim().slice(0, n);

export function track(name: string, params: Params = {}) {
  window.gtag('event', name, params);
  if (debug || !live) console.debug('[ga]', name, params);
}

// ---------- page context ----------
const path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
const group =
  path === '/' ? 'Home'
  : path === '/blog' ? 'Blog index'
  : path.startsWith('/blog/') ? 'Blog article'
  : path === '/work' ? 'Work'
  : path.startsWith('/work/') ? 'Work project'
  : path === '/services' ? 'Services'
  : path === '/how-it-works' ? 'How it works'
  : path === '/contact' ? 'Contact'
  : path === '/ask-ai' ? 'Ask AI'
  : path === '/coming-soon' ? 'Coming soon'
  : 'Other';

const article = document.querySelector<HTMLElement>('[data-post]');
const a = article?.dataset ?? {};
const articleParams: Params = article
  ? {
      article_id: a.post,
      article_title: clip(a.title),
      article_topic: a.topic,
      article_tags: clip(a.tags),
      article_steps: Number(a.steps || 0),
      article_words: Number(a.words || 0),
      article_minutes: Number(a.minutes || 0),
      article_published: a.published,
    }
  : {};

const ref = document.referrer ? new URL(document.referrer) : null;
const cameFrom = !ref ? 'direct'
  : ref.hostname === location.hostname ? `internal:${ref.pathname.replace(/\.html$/, '') || '/'}`
  : /google\./.test(ref.hostname) ? 'google'
  : /bing\.|duckduckgo|yahoo/.test(ref.hostname) ? 'other_search'
  : /chatgpt|openai|perplexity|claude\.ai|gemini|copilot/.test(ref.hostname) ? 'ai_assistant'
  : /whatsapp|wa\.me/.test(ref.hostname) ? 'whatsapp'
  : /instagram|facebook|linkedin|t\.co|x\.com|twitter|youtube/.test(ref.hostname) ? 'social'
  : `site:${ref.hostname}`;

window.gtag('js', new Date());
window.gtag('config', site.gaId, {
  content_group: group,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
  ...(debug ? { debug_mode: true } : {}),
  ...articleParams,
});

if (live) {
  const load = () => {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${site.gaId}`;
    document.head.append(s);
  };
  // Load on the first scroll, tap or key press (almost every visitor), or after 8 s for those who
  // only look. Queued events, including this page view, are sent as soon as it arrives.
  let loaded = false;
  const kicks = ['scroll', 'pointerdown', 'keydown', 'touchstart', 'mousemove'];
  const once = () => {
    if (loaded) return;
    loaded = true;
    kicks.forEach((ev) => removeEventListener(ev, once));
    load();
  };
  kicks.forEach((ev) => addEventListener(ev, once, { passive: true }));
  const start = () => setTimeout(once, 8000);
  if (document.readyState === 'complete') start();
  else addEventListener('load', start, { once: true });
}

// ---------- where on the page ----------
function where(el: Element): string {
  const tagged = el.closest<HTMLElement>('[data-cta]')?.dataset.cta;
  if (tagged) return tagged;
  if (el.closest('.site-header')) return el.closest('#mobile-menu') ? 'mobile_menu' : 'header';
  if (el.closest('.site-footer')) return 'footer';
  if (el.closest('.wa-fab')) return 'floating_whatsapp';
  if (el.closest('.toc')) return 'article_toc';
  if (el.closest('.share-row')) return 'article_share';
  if (el.closest('.more')) return 'keep_reading';
  if (el.closest('[data-prose]')) return 'article_body';
  if (el.closest('.a-head')) return 'article_header';
  const section = el.closest('section');
  if (section) {
    if (section.id) return section.id;
    const h = section.querySelector('h1, h2');
    if (h) return clip(h.textContent, 40).toLowerCase();
  }
  return 'page';
}

const textOf = (el: Element) => clip(el.getAttribute('aria-label') || el.textContent, 60);

// ---------- every click ----------
document.addEventListener('click', (e) => {
  const target = e.target as Element | null;
  const el = target?.closest<HTMLElement>('a[href], button, [role="button"], summary');
  if (!el) return;
  const location_ = where(el);
  const text = textOf(el.querySelector('h3') ?? el);
  const base: Params = { location: location_, link_text: text, page_group: group, ...(article ? { article_id: a.post } : {}) };

  if (el.tagName === 'SUMMARY') return; // handled by the toggle listener

  if (el instanceof HTMLAnchorElement) {
    const href = el.getAttribute('href') ?? '';
    const url = new URL(el.href, location.href);

    if (el.closest('.share-row')) {
      const method = /wa\.me/.test(url.hostname) ? 'whatsapp' : /linkedin/.test(url.hostname) ? 'linkedin' : /x\.com|twitter/.test(url.hostname) ? 'x' : 'other';
      return track('share', { ...base, method, content_type: 'article', item_id: a.post });
    }
    if (el.hasAttribute('data-anchor')) return track('section_link_copy', { ...base, section_id: href.slice(1) });
    if (el.hasAttribute('data-toc-link')) return track('toc_click', { ...base, section_id: el.dataset.tocLink, section_title: text });
    if (/wa\.me$/.test(url.hostname)) return track('whatsapp_click', base);
    if (url.protocol === 'tel:') return track('call_click', base);
    if (url.protocol === 'mailto:') return track('email_click', base);
    if (url.pathname === '/coming-soon') return track('social_click', { ...base, network: url.searchParams.get('on') ?? '', status: 'coming_soon' });
    if (/instagram|linkedin|youtube|facebook|x\.com/.test(url.hostname)) return track('social_click', { ...base, network: url.hostname.replace(/^www\./, '').split('.')[0], status: 'live' });
    if (href.startsWith('#')) return track('jump_link_click', { ...base, section_id: href.slice(1) });

    if (url.hostname === location.hostname) {
      const dest = url.pathname.replace(/\.html$/, '') || '/';
      if (/^\/blog\/[^/]+$/.test(dest)) {
        const card = el.closest('[data-card]');
        const list = card ? 'blog_index' : el.closest('.more') ? 'keep_reading' : location_;
        const position = card ? Array.from(card.parentElement?.querySelectorAll('[data-card]:not([hidden])') ?? []).indexOf(card) + 1 : undefined;
        return track('select_content', { ...base, content_type: 'article', item_id: dest.split('/')[2], item_list: list, position, featured: card?.classList.contains('feat') });
      }
      if (/^\/work\/[^/]+$/.test(dest)) return track('select_content', { ...base, content_type: 'project', item_id: dest.split('/')[2] });
      if (dest === '/contact') return track('cta_click', { ...base, destination: dest });
      if (el.closest('.site-header, .site-footer')) return track('nav_click', { ...base, destination: dest });
      return track('link_click', { ...base, destination: dest });
    }
    return track('outbound_click', { ...base, destination: clip(url.hostname + url.pathname, 100) });
  }

  // Buttons
  const d = el.dataset;
  if (d.done) {
    const on = el.getAttribute('aria-pressed') === 'true';
    const heading = el.closest('h2');
    const total = document.querySelectorAll('[data-done]').length;
    const doneNow = document.querySelectorAll('[data-done][aria-pressed="true"]').length;
    track(on ? 'step_done' : 'step_undone', {
      ...base,
      step_number: Number(heading?.dataset.step ?? 0),
      step_title: clip(heading?.querySelector('.step-title')?.textContent?.replace(/^Step \d+:\s*/, ''), 80),
      steps_done: doneNow,
      steps_total: total,
    });
    if (on && doneNow === total) track('all_steps_done', { ...base, steps_total: total });
    return;
  }
  if (d.vote) return track('helpful_vote', { ...base, vote: d.vote });
  if (d.copy !== undefined) {
    return el.closest('[data-ask]')
      ? track('ask_ai_copy', base)
      : track('share', { ...base, method: 'copy_link', content_type: 'article', item_id: a.post });
  }
  if (d.engine) {
    const need = el.closest('[data-ask]')?.querySelector<HTMLInputElement>('input[name="ask-need"]:checked')?.value;
    return track('ask_ai_open', { ...base, engine: d.engine, need });
  }
  if (d.topic !== undefined) return track('blog_topic_filter', { ...base, topic: d.topic || 'All' });
  if (d.filter) return track('work_filter', { ...base, filter: d.filter });
  if (el.hasAttribute('data-blog-reset')) return track('blog_search_reset', base);
  if (el.hasAttribute('data-menu-toggle')) return track('menu_toggle', { ...base, state: el.getAttribute('aria-expanded') === 'true' ? 'open' : 'close' });
  if ((el as HTMLButtonElement).type === 'submit') return; // forms report their own result
  track('button_click', base);
});

// FAQ answers, table of contents and other open/close panels (only when a person toggles them)
let userAct = 0;
['pointerdown', 'keydown'].forEach((ev) => addEventListener(ev, () => { userAct = Date.now(); }, { capture: true, passive: true }));
document.addEventListener(
  'toggle',
  (e) => {
    const det = e.target as HTMLDetailsElement;
    if (!(det instanceof HTMLDetailsElement) || Date.now() - userAct > 1500) return;
    const title = clip(det.querySelector('summary')?.textContent, 90);
    const state = det.open ? 'open' : 'close';
    if (det.hasAttribute('data-toc')) track('toc_toggle', { state, article_id: a.post });
    else if (det.classList.contains('item')) track('faq_toggle', { question: title, state, location: where(det) });
    else track('panel_toggle', { panel: title, state, location: where(det) });
  },
  true,
);

// ---------- forms (results come from forms.ts) ----------
document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
  const formId = form.id || form.getAttribute('name') || path;
  const fieldsTouched = new Set<string>();
  form.addEventListener('focusin', (e) => {
    const name = (e.target as HTMLInputElement).name;
    if (!name || name.startsWith('_')) return;
    if (!fieldsTouched.size) track('form_start', { form_id: formId, first_field: name, page_group: group });
    fieldsTouched.add(name);
  });
  form.addEventListener('ss:form', (e) => {
    const { status, fields, country } = (e as CustomEvent<{ status: string; fields?: string[]; country?: string }>).detail;
    if (status === 'success') track('generate_lead', { form_id: formId, phone_country: country, page_group: group, fields_touched: fieldsTouched.size });
    else if (status === 'invalid') track('form_error', { form_id: formId, error_fields: (fields ?? []).join(','), error_count: fields?.length ?? 0 });
    else track('form_send_failed', { form_id: formId, reason: status });
  });
});

// ---------- blog index: search ----------
const search = document.querySelector<HTMLInputElement>('[data-blog-search]');
if (search) {
  let timer = 0;
  let last = '';
  search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      const term = clip(search.value, 60).toLowerCase();
      if (!term || term === last) return;
      last = term;
      const results = document.querySelectorAll('[data-card]:not([hidden])').length;
      track('search', { search_term: term, results_count: results, location: 'blog_index' });
      if (!results) track('search_no_results', { search_term: term });
    }, 1200);
  });
}

// ---------- blog article: reading behaviour ----------
if (article) {
  const id = a.post!;
  const prose = article.querySelector<HTMLElement>('[data-prose]');
  const expected = Number(a.minutes || 1) * 60;

  // Repeat visits on this device
  let visit = 1;
  try {
    visit = Number(localStorage.getItem(`fn-seen:${id}`) ?? 0) + 1;
    localStorage.setItem(`fn-seen:${id}`, String(visit));
  } catch { /* private mode */ }
  track('article_view', { ...articleParams, visit_number: visit, is_repeat: visit > 1, came_from: cameFrom });

  // Active reading time: counts only while the tab is visible and the reader moved in the last 30 s
  let active = 0;
  let lastMove = Date.now();
  const bump = () => { lastMove = Date.now(); };
  ['scroll', 'pointermove', 'keydown', 'touchstart', 'wheel'].forEach((ev) => addEventListener(ev, bump, { passive: true }));
  const timeMarks = [10, 30, 60, 120, 180, 300, 600, 900];
  setInterval(() => {
    if (document.visibilityState !== 'visible' || Date.now() - lastMove > 30000) return;
    active += 1;
    if (timeMarks.includes(active)) track('article_read_time', { article_id: id, seconds: active, read_ratio: +(active / expected).toFixed(2) });
  }, 1000);

  // Scroll depth through the article text
  const depthMarks = [10, 25, 50, 75, 90, 100];
  let maxDepth = 0;
  const onScroll = () => {
    if (!prose) return;
    const r = prose.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, Math.round(((innerHeight - r.top) / r.height) * 100)));
    if (pct <= maxDepth) return;
    depthMarks.filter((m) => m > maxDepth && m <= pct).forEach((m) => track('article_scroll', { article_id: id, percent: m, seconds: active }));
    maxDepth = pct;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Each section reached
  const heads = Array.from(prose?.querySelectorAll<HTMLElement>('h2[id]') ?? []);
  const seen = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      const h = en.target as HTMLElement;
      if (!en.isIntersecting || seen.has(h.id)) return;
      seen.add(h.id);
      io.unobserve(h);
      track('article_section_view', {
        article_id: id,
        section_id: h.id,
        section_title: clip(h.querySelector('.step-title')?.textContent?.replace(/^Step \d+:\s*/, '') ?? h.firstChild?.textContent, 80),
        section_index: heads.indexOf(h) + 1,
        sections_total: heads.length,
        step_number: Number(h.dataset.step ?? 0),
        seconds: active,
      });
    }),
    { rootMargin: '0px 0px -40% 0px' },
  );
  heads.forEach((h) => io.observe(h));

  // Reached the end of the article
  let completed = false;
  const end = article.querySelector('.a-foot');
  if (end) {
    const endIo = new IntersectionObserver((entries) => {
      if (!entries.some((en) => en.isIntersecting) || completed) return;
      completed = true;
      endIo.disconnect();
      const ratio = active / expected;
      track('article_complete', {
        article_id: id,
        seconds: active,
        read_ratio: +ratio.toFixed(2),
        reader_type: ratio >= 0.5 ? 'reader' : ratio >= 0.2 ? 'skimmer' : 'scroller',
      });
    });
    endIo.observe(end);
  }

  // Copying text from the guide (only the size and section, never the text)
  prose?.addEventListener('copy', () => {
    const sel = getSelection();
    const node = sel?.anchorNode instanceof Element ? sel.anchorNode : sel?.anchorNode?.parentElement;
    let h: Element | null | undefined = node?.closest('h2');
    if (!h) {
      h = node;
      while (h && h.parentElement !== prose && h.parentElement) h = h.parentElement;
      while (h && h.tagName !== 'H2') h = h.previousElementSibling;
    }
    track('article_text_copy', { article_id: id, chars: sel?.toString().length ?? 0, section_id: h?.id ?? 'intro' });
  });

  // One summary when the reader leaves
  let sent = false;
  const summary = () => {
    if (sent) return;
    sent = true;
    track('article_exit', {
      article_id: id,
      seconds: active,
      max_scroll: maxDepth,
      sections_seen: seen.size,
      sections_total: heads.length,
      steps_done: document.querySelectorAll('[data-done][aria-pressed="true"]').length,
      completed,
      transport_type: 'beacon',
    });
  };
  addEventListener('pagehide', summary);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') summary(); });
}
