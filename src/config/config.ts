import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  storagePath: process.env.STORAGE_PATH || './storage',
  tempPath: process.env.TEMP_PATH || './temp',
  encoding: {
    videoCodec: process.env.VIDEO_TARGET_CODEC || 'libx264',
    videoFormat: process.env.VIDEO_TARGET_FORMAT || 'mp4',
    audioCodec: process.env.AUDIO_TARGET_CODEC || 'aac',
    targetFps: parseInt(process.env.TARGET_FPS || '30', 10),
    targetBitrate: process.env.TARGET_BITRATE || '5000k',
    targetResolution: process.env.TARGET_RESOLUTION || '1920x1080',
  },
};
