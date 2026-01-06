import { Video } from '../../domain/entities';
import { IVideoRepository } from '../../domain/repositories';
import { FileSystemRepository } from './FileSystemRepository';

export class VideoRepository extends FileSystemRepository<Video> implements IVideoRepository {
  constructor() {
    super('videos.json');
  }

  async search(params: any): Promise<{ videos: Video[]; total: number }> {
    // Map SearchParams to local logic
    let videos = await this.readAll();

    // 1. Text Search
    if (params.textSearch) {
      const q = params.textSearch.toLowerCase();
      videos = videos.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.creator.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
      );
    }

    // 2. Filters
    if (params.filter) {
        Object.keys(params.filter).forEach(key => {
            const val = params.filter[key];
            if (val === undefined) return;

            if (key === 'genres' && Array.isArray(val)) {
                videos = videos.filter(v => val.some((g: string) => v.genres.includes(g)));
            } else if (key === 'language') {
                videos = videos.filter(v => v.language.toLowerCase() === val.toLowerCase());
            } else if (key === 'targetAudience') {
                videos = videos.filter(v => v.targetAudience.toLowerCase() === val.toLowerCase());
            }
        });
    }

    // 3. Sorting
    if (params.sort) {
       if (params.sort === 'uploadTime') {
          videos.sort((a, b) => new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime());
       } else if (params.sort === '-uploadTime') {
          videos.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime());
       }
    }

    const total = videos.length;

    // 4. Pagination
    if (params.page && params.limit) {
      const start = (params.page - 1) * params.limit;
      videos = videos.slice(start, start + params.limit);
    }

    return { videos, total };
  }
}
