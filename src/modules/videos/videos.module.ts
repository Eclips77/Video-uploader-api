import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { Video, VideoSchema } from './schemas/video.schema';
import { VideoProcessingListener } from './listeners/video-processing.listener';
import { StorageModule } from '../storage/storage.module';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    StorageModule,
    FfmpegModule,
  ],
  controllers: [VideosController],
  providers: [VideosService, VideoProcessingListener],
})
export class VideosModule {}
