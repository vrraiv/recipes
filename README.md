# The Recipe Box

A static Astro site holding the recipes we actually cook, deployed to a
subdomain via Cloudflare Workers static assets.

Two recipes are seeded: one written from scratch, one adapted from an outside
source to demonstrate the attribution pattern.

## Status: building on Astro 7

The site is compiled and building clean on Astro 7 (static output) with
Wrangler 4 for the assets-only deploy. Requires Node 22.12+.

## Getting started

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static output to dist/
npm run check        # type-check + content-schema diagnostics
```

## Project layout

```
src/
  content.config.ts              schema every recipe is validated against
  content/recipes/*.md           one file per recipe — this is the real content
  layouts/Base.astro             html shell, masthead, noindex tag
  pages/index.astro              recipe list
  pages/recipes/[...id].astro    recipe page, renders markdown + attribution
  styles/global.css              all styling, no framework
astro.config.mjs                 set `site` to your real subdomain
wrangler.jsonc                   set `name` and the custom domain route
```

## Adding a recipe

Create `src/content/recipes/some-slug.md`. The filename becomes the URL. The
frontmatter is schema-validated, so the build fails loudly on a typo rather
than shipping a broken page.

```yaml
---
title: Braised Short Ribs
summary: One line describing what this is and why it's worth making.
servings: 4
prepMinutes: 20
cookMinutes: 180
tags: [mains, beef, make-ahead]
source:
  origin: own          # own | adapted | reference
updated: 2026-09-13
---
```

For anything taken from elsewhere:

```yaml
source:
  origin: adapted
  publisher: Serious Eats
  author: Author Name
  url: https://example.com/the-recipe
  note: Optional line about what was changed or condensed.
verified: false        # flip to true once checked against the source
```

`origin: own` renders no attribution block. Anything else renders a credit
line and a link at the bottom of the page. Recipes with `verified: false` show
an "unverified" badge in the index.

The body uses `## Ingredients` and `## Method` headings, with `## Notes` last.
The stylesheet keys off that structure — the first list after a heading gets the
roomy, scannable ingredient treatment, and ordered lists get numbered markers.

## Deploying to Cloudflare

The domain is set to `recipes.vikramrai.com` in both `wrangler.jsonc` (the
custom-domain route) and `astro.config.mjs` (`site`). The zone must be active in
the same Cloudflare account before the first deploy. Then authenticate and ship:

```bash
npx wrangler login
npm run deploy        # astro build && wrangler deploy
```

This deploys as an assets-only Worker — no server-side code, Cloudflare serves
`dist/` straight from the edge. Subsequent deploys are the same command.

## Keeping it to the family

The site is public by default once deployed, so two things are already in place:
`noindex, nofollow` in the page head, and `rel="nofollow"` on outbound source
links.

If you want it genuinely private rather than merely unlisted, put Cloudflare
Access in front of it: **Zero Trust → Access → Applications → Add self-hosted**,
point it at the subdomain, and add a policy allowing your and your wife's email
addresses. It's free at this scale and takes about five minutes. This is worth
doing — it turns the question of republishing other people's recipes from a
publishing question into a private-notes question.

## On third-party recipes

Ingredient lists and bare procedural steps aren't protected by copyright;
headnotes, technique essays, and the author's prose are. The pattern this repo
uses — quantities plus a method written in your own compressed words, with a
prominent link back — stays on the right side of that line and is the norm for
personal recipe collections. What to avoid is pasting the original write-up.

Keep the `source` block filled in honestly. It costs nothing and it's the
difference between a personal index and a scrape.
