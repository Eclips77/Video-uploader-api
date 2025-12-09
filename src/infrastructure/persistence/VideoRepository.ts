import { Video } from '../../domain/entities';
import { IVideoRepository } from '../../domain/repositories';
import { FileSystemRepository } from './FileSystemRepository';

export class VideoRepository extends FileSystemRepository<Video> implements IVideoRepository {
  constructor() {
    super('videos.json');
  }

  async search(query: { q?: string; genres?: string[]; language?: string; targetAudience?: string; page?: number; limit?: number; sort?: string }): Promise<{ videos: Video[]; total: number }> {
    let videos = await this.readAll();

    // 1. Filter by text (q) - fuzzyish (case insensitive substring)
    if (query.q) {
      const q = query.q.toLowerCase();
      videos = videos.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.creator.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
      );
    }

    // 2. Filter by Genres
    if (query.genres && query.genres.length > 0) {
      videos = videos.filter((v) => query.genres!.some((g) => v.genres.includes(g)));
    }

    // 3. Filter by Language
    if (query.language) {
      videos = videos.filter((v) => v.language.toLowerCase() === query.language!.toLowerCase());
    }

    // 4. Filter by Target Audience
    if (query.targetAudience) {
      videos = videos.filter((v) => v.targetAudience.toLowerCase() === query.targetAudience!.toLowerCase());
    }

    // 5. Sorting
    if (query.sort) {
       // Simple implementation: currently only supporting uploadTime desc/asc
       if (query.sort === 'uploadTime') {
          videos.sort((a, b) => new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime());
       } else if (query.sort === '-uploadTime') {
          videos.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime());
       }
    }

    const total = videos.length;

    // 6. Pagination
    if (query.page && query.limit) {
      const start = (query.page - 1) * query.limit;
      videos = videos.slice(start, start + query.limit);
    }

    return { videos, total };
  }
}
