import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';
import path from 'path';
import { config } from '../../config/config';
import { Logger } from '../logger/Logger';
import { AppError, InternalServerError } from '../../utils/AppError';
import { v4 as uuidv4 } from 'uuid';
import { IStorageService } from '../../domain/services/IStorageService';

const logger = Logger.getInstance();

export class EncodingService {
  constructor(private storageService: IStorageService) {}

  async processVideo(sourcePath: string): Promise<string> {
    logger.info(`Starting video processing for ${sourcePath}`);

    try {
      const metadata = await this.getMetadata(sourcePath);
      const shouldEncode = this.shouldEncode(metadata);

      if (!shouldEncode) {
        logger.info('Video matches target configuration. moving to storage.');
        // Move to final storage via service
        // Since we are not re-encoding, we upload the temp file directly.
        // We need to know mimetype or infer it.
        const mimeType = `video/${config.encoding.videoFormat}`; // Rough inference
        const fileObj = { path: sourcePath, originalname: `video.${config.encoding.videoFormat}`, mimetype: mimeType };

        const key = await this.storageService.upload(fileObj, 'videos');
        return key;
      }

      logger.info('Video requires encoding/remuxing.');
      return await this.encode(sourcePath);
    } catch (error) {
      logger.error('Error processing video', error);
      throw error;
    }
  }

  private getMetadata(filePath: string): Promise<ffmpeg.FfprobeStream> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        // Find the video stream
        const videoStream = metadata.streams.find((s) => s.codec_type === 'video');
        if (!videoStream) return reject(new Error('No video stream found'));
        resolve(videoStream);
      });
    });
  }

  private shouldEncode(stream: ffmpeg.FfprobeStream): boolean {
    const { videoCodec, targetFps, targetResolution } = config.encoding;

    // Check Codec
    // Note: fluent-ffmpeg usually returns codec_name like 'h264', config might say 'libx264'
    const currentCodec = stream.codec_name;
    const isCodecMatch = currentCodec === videoCodec || (videoCodec === 'libx264' && currentCodec === 'h264');

    if (!isCodecMatch) {
       return true;
    }

    // Check Resolution
    if (targetResolution) {
        const [w, h] = targetResolution.split('x').map(Number);
        if (stream.width !== w || stream.height !== h) return true;
    }

    // Check FPS
    // stream.r_frame_rate is usually "num/den", e.g., "30/1" or "30000/1001"
    if (stream.r_frame_rate) {
        const [num, den] = stream.r_frame_rate.split('/').map(Number);
        const fps = den ? num / den : num;
        if (Math.abs(fps - targetFps) > 1) { // Allow slight deviation
            return true;
        }
    }

    return false;
  }

  private async encode(sourcePath: string): Promise<string> {
    const tempEncodedPath = path.join(config.tempPath, `encoded-${uuidv4()}.${config.encoding.videoFormat}`);
    await fs.ensureDir(path.dirname(tempEncodedPath));

    return new Promise((resolve, reject) => {
      let command = ffmpeg(sourcePath)
        .videoCodec(config.encoding.videoCodec)
        .audioCodec(config.encoding.audioCodec)
        .format(config.encoding.videoFormat);

      if (config.encoding.targetResolution) {
        command = command.size(config.encoding.targetResolution);
      }

      // Bitrate handling
      if (config.encoding.targetBitrate) {
          command = command.videoBitrate(config.encoding.targetBitrate);
      }

      command
        .on('end', async () => {
          logger.info(`Encoding finished: ${tempEncodedPath}`);
          // Upload to storage
          try {
             const mimeType = `video/${config.encoding.videoFormat}`;
             const fileObj = { path: tempEncodedPath, originalname: path.basename(tempEncodedPath), mimetype: mimeType };
             const key = await this.storageService.upload(fileObj, 'videos');

             // Cleanup local temp encoded file
             await fs.remove(tempEncodedPath);
             // Cleanup source temp file
             await fs.remove(sourcePath);

             resolve(key);
          } catch (e: any) {
             logger.error('Failed to upload encoded file', e);
             reject(new InternalServerError(`Upload failed: ${e.message}`));
          }
        })
        .on('error', (err) => {
          logger.error('Encoding error', err);
          reject(new InternalServerError(`Encoding failed: ${err.message}`));
        })
        .save(tempEncodedPath);
    });
  }
}
