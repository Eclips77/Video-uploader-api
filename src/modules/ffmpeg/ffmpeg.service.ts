import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FfmpegService {
  private readonly logger = new Logger(FfmpegService.name);

  constructor(private configService: ConfigService) {}

  async encodeVideo(inputPath: string, outputPath: string): Promise<void> {
    this.logger.log(`Starting encoding from ${inputPath} to ${outputPath}`);

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath);

      const videoCodec = this.configService.get('VIDEO_TARGET_CODEC', 'libx264');
      const audioCodec = this.configService.get('AUDIO_TARGET_CODEC', 'aac');
      const format = this.configService.get('VIDEO_TARGET_FORMAT', 'mp4');
      const resolution = this.configService.get('TARGET_RESOLUTION');
      const bitrate = this.configService.get('TARGET_BITRATE');

      command = command
        .videoCodec(videoCodec)
        .audioCodec(audioCodec)
        .format(format);

      if (resolution) {
        command = command.size(resolution);
      }
      if (bitrate) {
        command = command.videoBitrate(bitrate);
      }

      command
        .on('end', () => {
          this.logger.log('Encoding finished successfully');
          resolve();
        })
        .on('error', (err) => {
          this.logger.error('Encoding failed', err);
          reject(err);
        })
        .save(outputPath);
    });
  }
}
