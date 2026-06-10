import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    year: z.number(),
    cover: z.string().optional(),
    featured: z.boolean().default(true),
    order: z.number().default(99),
  }),
});

export const collections = { work };
