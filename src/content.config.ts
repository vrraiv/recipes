import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recipes' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    servings: z.number().optional(),
    yield: z.string().optional(),
    prepMinutes: z.number().optional(),
    cookMinutes: z.number().optional(),
    tags: z.array(z.string()).default([]),

    // Attribution. `own` means we wrote it; anything else needs a publisher
    // and a URL so the page can credit the source.
    source: z
      .object({
        origin: z.enum(['own', 'adapted', 'reference']),
        publisher: z.string().optional(),
        author: z.string().optional(),
        url: z.url().optional(),
        note: z.string().optional(),
      })
      .default({ origin: 'own' }),

    // False while quantities or method are still unconfirmed against the source.
    verified: z.boolean().default(true),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { recipes };
