import { z } from 'zod';

export const CreateVideoSchema = z.object({
  title: z.string().min(1),
  creator: z.string().min(1),
  description: z.string().optional(),
  targetAudience: z.string().optional(),
  language: z.string().optional(),
  genres: z.string()
    .transform((str, ctx): string[] => {
      try {
        const parsed = JSON.parse(str);
        if(!Array.isArray(parsed)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Expected JSON array" });
            return z.NEVER;
        }
        return parsed;
      } catch (e) {
        // If it's a single string, maybe wrap it? Or just assume it's a JSON array string as it comes from multipart form-data
        // For simplicity, let's assume the client sends a JSON stringified array for 'genres'
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON" });
        return z.NEVER;
      }
    })
    .or(z.array(z.string())) // In case some middleware parses it already
    .default([]),
});

export type CreateVideoDto = z.infer<typeof CreateVideoSchema>;
