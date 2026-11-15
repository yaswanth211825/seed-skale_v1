// Shared helpers for the blog ("Field Notes").
import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Each guide gets its own bright colour set, picked by its main tag. */
const themes: Record<string, { bg: string; ink: string; pop: string; name: string }> = {
  AI: { bg: '#c9b8ff', ink: '#0b1f3a', pop: '#ff6b4a', name: 'lilac' },
  SEO: { bg: '#9ff0c8', ink: '#0b1f3a', pop: '#3563ff', name: 'mint' },
  Websites: { bg: '#ffd36b', ink: '#0b1f3a', pop: '#ff6b4a', name: 'sun' },
  Digitalisation: { bg: '#ffd36b', ink: '#0b1f3a', pop: '#ff6b4a', name: 'sun' },
  default: { bg: '#ffb4a2', ink: '#0b1f3a', pop: '#3563ff', name: 'peach' },
};
export const themeFor = (post: Post) => themes[post.data.tags[0]] ?? themes.default;

/** Phosphor icon per main tag. */
const icons: Record<string, string> = { AI: 'sparkle', SEO: 'magnifying-glass', Digitalisation: 'storefront', Websites: 'browser' };
export const iconFor = (post: Post) => icons[post.data.tags[0]] ?? 'lightbulb';

export const minutes = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 220));
export const stepCount = (body = '') => (body.match(/^##\s+Step\s+\d+/gim) ?? []).length;
export const fmtDate = (d: Date, month: 'short' | 'long' = 'short') =>
  d.toLocaleDateString('en-IN', { day: 'numeric', month, year: 'numeric' });

export const sortPosts = (posts: Post[]) =>
  posts.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
