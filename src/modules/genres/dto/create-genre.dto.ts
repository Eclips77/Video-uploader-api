import { z } from 'zod';

export const CreateGenreSchema = z.object({
  name: z.string().min(1),
});

export type CreateGenreDto = z.infer<typeof CreateGenreSchema>;
