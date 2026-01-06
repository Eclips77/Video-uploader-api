import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './modules/database/database.module';
import { StorageModule } from './modules/storage/storage.module';
import { FfmpegModule } from './modules/ffmpeg/ffmpeg.module';
import { GenresModule } from './modules/genres/genres.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { VideosModule } from './modules/videos/videos.module';
import { validate } from './common/configs/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    StorageModule,
    FfmpegModule,
    GenresModule,
    PlaylistsModule,
    VideosModule,
  ],
})
export class AppModule {}
