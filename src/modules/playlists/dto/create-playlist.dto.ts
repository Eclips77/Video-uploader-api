import { z } from 'zod';

export const CreatePlaylistSchema = z.object({
  name: z.string().min(1),
  videoIds: z.array(z.string().uuid()).default([]),
});

export type CreatePlaylistDto = z.infer<typeof CreatePlaylistSchema>;
