import { Request, Response, NextFunction } from 'express';
import { PlaylistService } from '../../../application/services/PlaylistService';
import { createPlaylistSchema, updatePlaylistSchema } from '../../../application/dtos/playlist.dto';
import { ValidationError } from '../../../utils/AppError';

export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playlists = await this.playlistService.getAll();
      res.json({ success: true, data: playlists });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playlist = await this.playlistService.getById(req.params.id);
      res.json({ success: true, data: playlist });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = createPlaylistSchema.safeParse(req.body);
      if (!validated.success) {
        throw new ValidationError('Invalid input', validated.error.issues);
      }

      const playlist = await this.playlistService.create(validated.data.name, validated.data.videoIds);
      res.status(201).json({ success: true, data: playlist });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = updatePlaylistSchema.safeParse(req.body);
      if (!validated.success) {
        throw new ValidationError('Invalid input', validated.error.issues);
      }

      const playlist = await this.playlistService.update(req.params.id, validated.data);
      res.json({ success: true, data: playlist });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.playlistService.delete(req.params.id);
      res.json({ success: true, message: 'Playlist deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
