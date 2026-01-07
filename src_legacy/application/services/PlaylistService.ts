import { v4 as uuidv4 } from 'uuid';
import { Playlist } from '../../domain/entities';
import { IPlaylistRepository, IVideoRepository } from '../../domain/repositories';
import { NotFoundError, ValidationError, InternalServerError } from '../../utils/AppError';

export class PlaylistService {
  constructor(
    private playlistRepository: IPlaylistRepository,
    private videoRepository: IVideoRepository
  ) {}

  async getAll(): Promise<Playlist[]> {
    return this.playlistRepository.findAll();
  }

  async getById(id: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findById(id);
    if (!playlist) throw new NotFoundError(`Playlist with ID ${id} not found`);
    return playlist;
  }

  async create(name: string, videoIds: string[] = []): Promise<Playlist> {
    // Validate videos exist
    for (const vid of videoIds) {
      const video = await this.videoRepository.findById(vid);
      if (!video) throw new ValidationError(`Video with ID ${vid} not found`);
    }

    // Ensure no duplicates
    const uniqueIds = Array.from(new Set(videoIds));

    const playlist: Playlist = {
      id: uuidv4(),
      name,
      videoIds: uniqueIds,
    };

    return this.playlistRepository.create(playlist);
  }

  async update(id: string, data: { name?: string; addVideoIds?: string[]; removeVideoIds?: string[] }): Promise<Playlist> {
    const playlist = await this.playlistRepository.findById(id);
    if (!playlist) throw new NotFoundError(`Playlist with ID ${id} not found`);

    // Calculate new video list
    let currentVideoIds = [...playlist.videoIds];

    // Remove first
    if (data.removeVideoIds) {
      const toRemove = new Set(data.removeVideoIds);
      currentVideoIds = currentVideoIds.filter((vid) => !toRemove.has(vid));
    }

    // Add next
    if (data.addVideoIds) {
      // Validate added videos exist
      for (const vid of data.addVideoIds) {
        const video = await this.videoRepository.findById(vid);
        if (!video) throw new ValidationError(`Video with ID ${vid} not found`);
      }
      currentVideoIds.push(...data.addVideoIds);
    }

    // De-duplicate
    currentVideoIds = Array.from(new Set(currentVideoIds));

    const updateData: Partial<Playlist> = { videoIds: currentVideoIds };
    if (data.name) updateData.name = data.name;

    const updated = await this.playlistRepository.update(id, updateData);
    if (!updated) throw new InternalServerError('Failed to update playlist');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const success = await this.playlistRepository.delete(id);
    if (!success) throw new NotFoundError(`Playlist with ID ${id} not found`);
  }
}
