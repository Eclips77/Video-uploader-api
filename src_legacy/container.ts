import { IVideoRepository, IGenreRepository, IPlaylistRepository } from './domain/repositories';
import { IStorageService } from './domain/services/IStorageService';
import { config } from './config/config';
import { VideoRepository } from './infrastructure/persistence/VideoRepository';
import { GenreRepository } from './infrastructure/persistence/GenreRepository';
import { PlaylistRepository } from './infrastructure/persistence/PlaylistRepository';
import { MongoVideoRepository } from './infrastructure/persistence/mongo/MongoVideoRepository';
import { MongoGenreRepository } from './infrastructure/persistence/mongo/MongoGenreRepository';
import { MongoPlaylistRepository } from './infrastructure/persistence/mongo/MongoPlaylistRepository';
import { FileSystemStorageService } from './infrastructure/storage/FileSystemStorageService';
import { S3StorageService } from './infrastructure/storage/S3StorageService';
import mongoose from 'mongoose';
import { Logger } from './infrastructure/logger/Logger';

const logger = Logger.getInstance();

class Container {
  public videoRepository: IVideoRepository;
  public genreRepository: IGenreRepository;
  public playlistRepository: IPlaylistRepository;
  public storageService: IStorageService;

  constructor() {
    // Init Repositories
    if (config.db.type === 'mongo') {
      this.initMongo();
      this.videoRepository = new MongoVideoRepository();
      this.genreRepository = new MongoGenreRepository();
      this.playlistRepository = new MongoPlaylistRepository();
    } else {
      this.videoRepository = new VideoRepository();
      this.genreRepository = new GenreRepository();
      this.playlistRepository = new PlaylistRepository();
    }

    // Init Storage
    if (config.storage.type === 's3') {
      this.storageService = new S3StorageService();
    } else {
      this.storageService = new FileSystemStorageService();
    }
  }

  private async initMongo() {
    try {
      await mongoose.connect(config.db.mongoUri);
      logger.info('Connected to MongoDB');
    } catch (error) {
      logger.error('Failed to connect to MongoDB', error);
      process.exit(1);
    }
  }
}

export const container = new Container();
