# Working in this repo

A private family recipe site. Astro 7, static output, deployed to Cloudflare
Workers static assets. No framework integrations, no CSS framework, no client
JavaScript — keep it that way unless there's a concrete reason not to.

## Build

The scaffold is compiled and building clean on Astro 7. Setup is just:

```bash
npm install && npm run build
```

Requires Node 22.12+ (Astro 7's floor) and Wrangler 4 for the assets-only
config. Notes on the content-collections API (`src/content.config.ts`): it uses
the `glob` loader, `render()` from `astro:content`, and `entry.id` (not the
older `entry.slug`). Zod comes from `astro/zod`, not re-exported from
`astro:content` — that re-export is deprecated as of Astro 7 and goes away in
Astro 8. The schema is on zod v4, so use the top-level string formats
(`z.url()`), not the deprecated chained methods (`z.string().url()`). When
bumping Astro or Wrangler, check the current docs rather than assuming.

## What matters here

**The markdown files are the product.** Everything in `src/pages` and
`src/styles` exists to render `src/content/recipes/*.md` legibly. When a change
could be made either in content or in code, prefer content.

**This gets read on a phone in a kitchen.** Large type, high contrast, no hover
dependencies, no layout that needs two hands. Don't shrink the body text.
Don't add animation.

**Fail at build time, not at read time.** The Zod schema in
`src/content.config.ts` is deliberately strict. When adding a field, add it to
the schema too. A missing quantity should break the build, not silently render
an incomplete recipe.

## Adding recipes from other sources

Always fill in the `source` block with `origin`, `publisher`, and `url`.

Write the method in condensed original wording — the useful sequence of
operations, not the author's prose. Do not copy headnotes, technique essays, or
descriptive passages from the source. Ingredient quantities are facts and can be
transcribed directly.

If a quantity can't be verified from the source, set `verified: false` and mark
the gap inline with a backticked `SOMETHING_TK` placeholder rather than guessing
a plausible number. An invented quantity in a recipe is worse than a visible
hole.

Treat aggregator and third-party copies as unverified even when they look
complete. The waffle recipe was first drafted from one, which was both missing
the flour weight and wrong about the buttermilk by 45 g — enough to change the
batter. Confirm against the publisher or against a copy the user supplies before
flipping `verified` to true.

## House style for recipe markdown

- Body sections in order: intro, `## Ingredients`, `## Method`, `## Notes`.
- The intro is a short, plain-English descriptive sentence fragment — what the
  dish is, nothing more. No cute paragraph, no explanation of the recipe's
  distinguishing features or the reasoning behind it. Anything worth saying
  about technique or trade-offs belongs in `## Notes`.
- Ingredients as an unordered list, quantity first, prep state after the comma
  (`150 g unsalted butter, cubed and softened`).
- Method as an ordered list. Lead each step with a bolded imperative phrase.
- Metric first. This is a Canadian kitchen.
- Notes cover substitutions, make-ahead, storage, and equipment workarounds.
- Write plainly. No "simply", no "perfect", no food-blog throat-clearing.

## Deploying

`npm run deploy` runs the build and ships it. Don't deploy without building
locally first — there's no CI.
