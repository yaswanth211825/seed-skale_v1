// Build-time touches for blog articles (no extra dependencies):
// - stable ids on h2/h3, plus a visible "#" link so any section can be shared
// - "Step N: Title" headings become a numbered badge + title, with a "mark as done" toggle
// - a SkaleSeed call-to-action card halfway through every article

const text = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(text).join('');

export const slug = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');

const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });
const t = (value) => ({ type: 'text', value });

export default function rehypeBlog() {
  return (tree) => {
    const seen = new Map();
    const body = tree.children;
    let stepCount = 0;

    body.forEach((node) => {
      if (node.type !== 'element' || !/^h[23]$/.test(node.tagName)) return;
      const label = text(node).trim();
      const base = slug(label) || 'section';
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      const id = n ? `${base}-${n}` : base;
      node.properties = { ...node.properties, id };

      const step = node.tagName === 'h2' && label.match(/^Step\s+(\d+)\s*[:.-]\s*(.+)$/i);
      if (step) {
        stepCount += 1;
        node.properties.className = ['step-h'];
        node.properties['data-step'] = step[1];
        node.children = [
          el('span', { className: ['step-no'], ariaHidden: 'true' }, [t(step[1])]),
          el('span', { className: ['step-title'] }, [
            el('span', { className: ['sr-only'] }, [t(`Step ${step[1]}: `)]),
            t(step[2]),
          ]),
        ];
      }

      node.children.push(
        el('a', { className: ['h-anchor'], href: `#${id}`, ariaLabel: `Link to “${label}”`, 'data-anchor': '' }, [t('#')]),
      );
      if (step) {
        node.children.push(
          el('button', { type: 'button', className: ['done-btn'], 'data-done': id, ariaPressed: 'false' }, [
            el('span', { className: ['done-box'], ariaHidden: 'true' }),
            el('span', { className: ['done-label'] }, [t('Mark done')]),
          ]),
        );
      }
    });

    // Call-to-action card before the middle step heading.
    if (stepCount >= 3) {
      const middle = Math.ceil(stepCount / 2) + 1;
      const at = body.findIndex((n) => n.properties?.['data-step'] === String(middle));
      if (at > 0) {
        body.splice(
          at,
          0,
          el('aside', { className: ['mid-cta'], ariaLabel: 'Free demo from SkaleSeed' }, [
            el('p', { className: ['mid-cta-kicker'] }, [t('Rather have it done for you?')]),
            el('p', { className: ['mid-cta-title'] }, [t('We build all of this for local businesses. See your free demo page first.')]),
            el('a', { className: ['mid-cta-btn'], href: '/contact', 'data-cta': 'blog-mid' }, [t('Get my free demo →')]),
          ]),
        );
      }
    }
  };
}
