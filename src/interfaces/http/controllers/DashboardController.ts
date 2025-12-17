import { Request, Response, NextFunction } from 'express';
import { IVideoRepository, IGenreRepository, IPlaylistRepository } from '../../../domain/repositories';

export class DashboardController {
  constructor(
    private videoRepo: IVideoRepository,
    private genreRepo: IGenreRepository,
    private playlistRepo: IPlaylistRepository
  ) {}

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const videos = await this.videoRepo.findAll();
      const genres = await this.genreRepo.findAll();
      const playlists = await this.playlistRepo.findAll();

      res.json({
        success: true,
        data: {
          totalVideos: videos.length,
          totalGenres: genres.length,
          totalPlaylists: playlists.length,
          recentVideos: videos.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()).slice(0, 5)
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
