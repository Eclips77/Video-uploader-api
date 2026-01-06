import { Request, Response, NextFunction } from 'express';
import { GenreService } from '../../../application/services/GenreService';
import { createGenreSchema, updateGenreSchema } from '../../../application/dtos/genre.dto';
import { ValidationError } from '../../../utils/AppError';

export class GenreController {
  constructor(private genreService: GenreService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genres = await this.genreService.getAll();
      res.json({ success: true, data: genres });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genre = await this.genreService.getById(req.params.id);
      res.json({ success: true, data: genre });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = createGenreSchema.safeParse(req.body);
      if (!validated.success) {
        throw new ValidationError('Invalid input', validated.error.issues);
      }

      const genre = await this.genreService.create(validated.data.name);
      res.status(201).json({ success: true, data: genre });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = updateGenreSchema.safeParse(req.body);
      if (!validated.success) {
        throw new ValidationError('Invalid input', validated.error.issues);
      }

      const genre = await this.genreService.update(req.params.id, validated.data.name);
      res.json({ success: true, data: genre });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.genreService.delete(req.params.id);
      res.json({ success: true, message: 'Genre deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
