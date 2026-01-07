import { z } from 'zod';

export const createVideoSchema = z.object({
  title: z.string().min(1),
  creator: z.string().min(1),
  description: z.string(),
  targetAudience: z.string(),
  language: z.string(),
  genres: z.array(z.string()).min(1), // Array of UUIDs
});

export const updateVideoSchema = z.object({
  title: z.string().optional(),
  creator: z.string().optional(),
  description: z.string().optional(),
  targetAudience: z.string().optional(),
  language: z.string().optional(),
  genres: z.array(z.string()).optional(),
});
