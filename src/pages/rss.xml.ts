import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { sortPosts } from '../data/blog';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET() {
  const posts = sortPosts(await getCollection('blog', ({ data }) => !data.draft));
  const items = posts
    .map((p) => {
      const url = `${site.url}/blog/${p.id}`;
      return `<item><title>${esc(p.data.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${p.data.published.toUTCString()}</pubDate><description>${esc(p.data.description)}</description>${p.data.tags.map((t) => `<category>${esc(t)}</category>`).join('')}</item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>SkaleSeed Field Notes</title><link>${site.url}/blog</link><description>Step-by-step guides to taking a business online, from the SkaleSeed team in Hyderabad.</description><language>en-in</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
