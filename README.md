# SkaleSeed website — version 2

Astro site: cream theme, case-study pages, blog, Ask AI, scroll animations.

## Run locally

```bash
npm ci
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Branches and deployment

- `main` — version 1 (static HTML, no build step)
- `v2` — this version (Astro; `vercel.json` sets the build)

In Vercel, the production site follows **Settings → Environments → Production →
Branch Tracking**. Set it to `v2` to go live with this version, or back to `main` to roll
back. For a quick one-off switch, open a `v2` deployment and choose **Promote to
Production**. Every push to either branch also gets its own preview URL.

Preview URLs are served with `noindex`, so Lighthouse SEO scores on preview links are
lower than on the production domain. Test SEO on the real domain or locally with
`npm run build && npm run preview`.
