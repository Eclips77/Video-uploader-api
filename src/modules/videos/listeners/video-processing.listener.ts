import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { VideoUploadedEvent } from '../events/video-uploaded.event';
import { VideosService } from '../videos.service';
import { FfmpegService } from '../../ffmpeg/ffmpeg.service';
import { VideoStatus } from '../schemas/video.schema';

@Injectable()
export class VideoProcessingListener {
  private readonly logger = new Logger(VideoProcessingListener.name);

  constructor(
    private readonly videosService: VideosService,
    private readonly ffmpegService: FfmpegService,
  ) {}

  @OnEvent('video.uploaded', { async: true })
  async handleVideoUploadedEvent(event: VideoUploadedEvent) {
    this.logger.log(`Processing video ${event.videoId} file ${event.filePath}`);

    try {
      // In a real scenario, we might change the path to a permanent storage path or HLS output
      // For this migration, we encode in place or to a new file and update the path?
      // The prompt says: "Call ffmpegService.encodeVideo(...)"
      // Let's assume we overwrite or create a new processed file.
      // Let's create a processed path.

      const processedPath = event.filePath.replace(/(\.[\w\d_-]+)$/i, '_processed$1');

      await this.ffmpegService.encodeVideo(event.filePath, processedPath);

      // Update video status and potentially path if it changed
      await this.videosService.updateStatus(event.videoId, VideoStatus.ACTIVE);
      // If we changed the file path, we might want to update it.
      // this.videosService.updateFilePath(event.videoId, processedPath);

      this.logger.log(`Video ${event.videoId} processed successfully.`);
    } catch (error) {
      this.logger.error(`Failed to process video ${event.videoId}`, error);
      await this.videosService.updateStatus(event.videoId, VideoStatus.FAILED);
    }
  }
}
