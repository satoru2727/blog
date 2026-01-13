// src/content.config.ts
// Configures the content collections for the blog
// This file is required by Astro's Content Layer API (v5+)
// RELEVANT FILES: src/pages/blog/[...id].astro, src/content/blog/*.md

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // Load Markdown files from the src/content/blog directory
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
