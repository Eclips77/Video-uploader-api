import { v4 as uuidv4 } from 'uuid';
import { Video } from '../../domain/entities';
import { IVideoRepository, IGenreRepository } from '../../domain/repositories';
import { EncodingService } from '../../infrastructure/encoding/EncodingService';
import { NotFoundError, ValidationError, InternalServerError } from '../../utils/AppError';
import fs from 'fs-extra';

export class VideoService {
  constructor(
    private videoRepository: IVideoRepository,
    private genreRepository: IGenreRepository,
    private encodingService: EncodingService
  ) {}

  async search(query: any) {
    return this.videoRepository.search(query);
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

    // Process Video
    let finalPath;
    try {
        finalPath = await this.encodingService.processVideo(filePath);
    } catch (err) {
        // cleanup upload if encoding fails
        await fs.remove(filePath);
        throw err;
    }

    const video: Video = {
      id: uuidv4(),
      ...data,
      uploadTime: new Date().toISOString(),
      filePath: finalPath,
    };

    return this.videoRepository.create(video);
  }

  async update(id: string, data: any, filePath?: string): Promise<Video> {
    const video = await this.videoRepository.findById(id);
    if (!video) {
        if (filePath) await fs.remove(filePath);
        throw new NotFoundError(`Video with ID ${id} not found`);
    }

    if (data.genres) {
       for (const genreId of data.genres) {
        const genre = await this.genreRepository.findById(genreId);
        if (!genre) {
            if (filePath) await fs.remove(filePath);
            throw new ValidationError(`Genre with ID ${genreId} not found`);
        }
      }
    }

    let updatedData = { ...data };

    if (filePath) {
      // Process new video file
      try {
          const finalPath = await this.encodingService.processVideo(filePath);
          // Delete old file if exists
          if (video.filePath && await fs.pathExists(video.filePath)) {
              await fs.remove(video.filePath);
          }
          updatedData.filePath = finalPath;
          updatedData.uploadTime = new Date().toISOString(); // Update upload time? Or keep original? Usually keep original unless replaced. Logic says "update video file", implies new content.
      } catch (err) {
          await fs.remove(filePath);
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

    if (video.filePath && await fs.pathExists(video.filePath)) {
      await fs.remove(video.filePath);
    }

    await this.videoRepository.delete(id);
  }
}
