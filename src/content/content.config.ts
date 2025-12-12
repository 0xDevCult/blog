import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        date: z.string().optional(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
  }),
};
