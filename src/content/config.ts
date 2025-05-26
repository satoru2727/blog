import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content', // v2.5.0 以降
  schema: z.object({
    title: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    description: z.string().optional(), 
  }),
});

export const collections = {
  'blog': blogCollection,
};
