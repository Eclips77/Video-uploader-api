import { z } from 'zod';

export const createPlaylistSchema = z.object({
  name: z.string().min(1),
  videoIds: z.array(z.string()).optional(),
});

export const updatePlaylistSchema = z.object({
  name: z.string().optional(),
  addVideoIds: z.array(z.string()).optional(),
  removeVideoIds: z.array(z.string()).optional(),
});
