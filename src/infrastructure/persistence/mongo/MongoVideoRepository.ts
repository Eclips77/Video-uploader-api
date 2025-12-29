import { IVideoRepository, SearchParams } from '../../../domain/repositories';
import { Video } from '../../../domain/entities';
import { MongoRepository } from './MongoRepository';
import { VideoModel, IVideoModel } from './schemas/Video';

export class MongoVideoRepository extends MongoRepository<Video, IVideoModel> implements IVideoRepository {
  constructor() {
    super(VideoModel);
  }

  async search(params: SearchParams): Promise<{ videos: Video[]; total: number }> {
    const query: any = {};

    // Text Search
    if (params.textSearch) {
      query.$text = { $search: params.textSearch };
    }

    // Filters (Exact match or specialized)
    if (params.filter) {
      // Map generic filters to mongo query
      // e.g. params.filter = { genres: ['id1', 'id2'], language: 'en' }
      Object.keys(params.filter).forEach(key => {
        const value = params.filter![key];
        if (key === 'genres' && Array.isArray(value)) {
           query.genres = { $in: value };
        } else if (value !== undefined) {
           query[key] = value;
        }
      });
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sort: any = {};
    if (params.sort) {
       const field = params.sort.startsWith('-') ? params.sort.substring(1) : params.sort;
       const order = params.sort.startsWith('-') ? -1 : 1;
       sort[field] = order;
    }

    const [videos, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit),
      this.model.countDocuments(query)
    ]);

    return {
      videos: videos.map((v: any) => v.toJSON() as Video),
      total
    };
  }
}
