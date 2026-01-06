import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.string().default('info'),
  MONGO_URI: z.string().default('mongodb://localhost:27017/video-api'),
  STORAGE_PATH: z.string().default('./storage'),
  TEMP_PATH: z.string().default('./temp'),
  // Encoding config
  VIDEO_TARGET_CODEC: z.string().default('libx264'),
  VIDEO_TARGET_FORMAT: z.string().default('mp4'),
  AUDIO_TARGET_CODEC: z.string().default('aac'),
  TARGET_FPS: z.coerce.number().default(30),
  TARGET_BITRATE: z.string().default('5000k'),
  TARGET_RESOLUTION: z.string().default('1920x1080'),
  // Toggles
  DB_TYPE: z.enum(['json', 'mongo']).default('mongo'), // Default to mongo for NestJS migration usually
  STORAGE_TYPE: z.enum(['fs', 's3']).default('fs'),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

export function validate(config: Record<string, unknown>) {
  const result = EnvSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Config validation error: ${result.error.message}`);
  }
  return result.data;
}
