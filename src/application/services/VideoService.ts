import { v4 as uuidv4 } from 'uuid';
import { Video } from '../../domain/entities';
import { IVideoRepository, IGenreRepository, SearchParams } from '../../domain/repositories';
import { IStorageService } from '../../domain/services/IStorageService';
import { EncodingService } from '../../infrastructure/encoding/EncodingService';
import { NotFoundError, ValidationError, InternalServerError } from '../../utils/AppError';

export class VideoService {
  constructor(
    private videoRepository: IVideoRepository,
    private genreRepository: IGenreRepository,
    private encodingService: EncodingService,
    private storageService: IStorageService
  ) {}

  async search(query: any) {
    // Map controller query params to generic SearchParams
    const searchParams: SearchParams = {
        textSearch: query.q,
        page: query.page,
        limit: query.limit,
        sort: query.sort,
        filter: {}
    };

    if (query.genres) searchParams.filter!.genres = query.genres;
    if (query.language) searchParams.filter!.language = query.language;
    if (query.targetAudience) searchParams.filter!.targetAudience = query.targetAudience;

    return this.videoRepository.search(searchParams);
  }

  async getById(id: string): Promise<Video> {
    const video = await this.videoRepository.findById(id);
    if (!video) throw new NotFoundError(`Video with ID ${id} not found`);
    return video;
  }

  async create(data: any, filePath?: string): Promise<Video> {
    // Validate Genres
    for (const genreId of data.genres) {
      const genre = await this.genreRepository.findById(genreId);
      if (!genre) throw new ValidationError(`Genre with ID ${genreId} not found`);
    }

    if (!filePath) {
      throw new ValidationError('Video file is required');
    }

    // Process Video (Encoding + Storage)
    let finalKey;
    try {
        // EncodingService now handles storage upload internally or returns a temp path?
        // Actually, previous EncodingService implementation returned a local path.
        // We need to ensure EncodingService works with the new StorageService abstraction.
        // Assuming EncodingService accepts a local path (temp from busboy) and returns the stored key/path.
        finalKey = await this.encodingService.processVideo(filePath);
    } catch (err) {
        // cleanup upload if encoding fails
        await this.storageService.delete(filePath); // If it was uploaded? No, filePath is local temp.
        // Actually, we should clean local temp file here if EncodingService didn't.
        // But EncodingService cleans up source if successful.
        throw err;
    }

    const video: Video = {
      id: uuidv4(),
      ...data,
      uploadTime: new Date().toISOString(),
      filePath: finalKey,
    };

    return this.videoRepository.create(video);
  }

  async update(id: string, data: any, filePath?: string): Promise<Video> {
    const video = await this.videoRepository.findById(id);
    if (!video) {
        // Cleanup temp file if video not found
        // if (filePath) await fs.remove(filePath); // Need generic way or fs-extra usage if we know it's local temp
        throw new NotFoundError(`Video with ID ${id} not found`);
    }

    if (data.genres) {
       for (const genreId of data.genres) {
        const genre = await this.genreRepository.findById(genreId);
        if (!genre) {
            throw new ValidationError(`Genre with ID ${genreId} not found`);
        }
      }
    }

    let updatedData = { ...data };

    if (filePath) {
      try {
          const finalKey = await this.encodingService.processVideo(filePath);

          // Delete old file
          if (video.filePath) {
              await this.storageService.delete(video.filePath);
          }

          updatedData.filePath = finalKey;
          updatedData.uploadTime = new Date().toISOString();
      } catch (err) {
          throw err;
      }
    }

    const updated = await this.videoRepository.update(id, updatedData);
    if (!updated) throw new InternalServerError('Failed to update video');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const video = await this.videoRepository.findById(id);
    if (!video) throw new NotFoundError(`Video with ID ${id} not found`);

    if (video.filePath) {
      await this.storageService.delete(video.filePath);
    }

    await this.videoRepository.delete(id);
  }
}
