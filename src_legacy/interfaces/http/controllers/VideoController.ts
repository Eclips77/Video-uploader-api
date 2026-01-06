import { Request, Response, NextFunction } from 'express';
import Busboy from 'busboy';
import path from 'path';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { VideoService } from '../../../application/services/VideoService';
import { createVideoSchema, updateVideoSchema } from '../../../application/dtos/video.dto';
import { ValidationError, BadRequestError } from '../../../utils/AppError';
import { config } from '../../../config/config';

export class VideoController {
  constructor(private videoService: VideoService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, genres, language, targetAudience, page, limit, sort } = req.query;
      const result = await this.videoService.search({
        q: q as string,
        genres: genres ? (Array.isArray(genres) ? genres : [genres]) as string[] : undefined,
        language: language as string,
        targetAudience: targetAudience as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        sort: sort as string,
      });
      res.json({ success: true, data: result.videos, meta: { totalItems: result.total } });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const video = await this.videoService.getById(req.params.id);
      res.json({ success: true, data: video });
    } catch (error) {
      next(error);
    }
  };

  // Helper to handle Busboy parsing
  private parseMultipart(req: Request): Promise<{ fields: any; filePath?: string }> {
    return new Promise((resolve, reject) => {
      const busboy = Busboy({ headers: req.headers });
      const fields: any = {};
      let uploadedFilePath: string | undefined;

      busboy.on('field', (fieldname, val) => {
        // Handle array fields (genres)
        if (Object.prototype.hasOwnProperty.call(fields, fieldname)) {
            if (Array.isArray(fields[fieldname])) {
                fields[fieldname].push(val);
            } else {
                fields[fieldname] = [fields[fieldname], val];
            }
        } else {
            fields[fieldname] = val;
        }
      });

      busboy.on('file', (fieldname, file, info) => {
        const { filename, mimeType } = info;
        // Basic validation
        if (!mimeType.startsWith('video/')) {
            file.resume(); // discard
            return reject(new ValidationError('Only video files are allowed'));
        }

        const saveTo = path.join(config.tempPath, `${uuidv4()}-${filename}`);
        uploadedFilePath = saveTo;

        fs.ensureDirSync(path.dirname(saveTo));
        file.pipe(fs.createWriteStream(saveTo));
      });

      busboy.on('finish', () => {
        resolve({ fields, filePath: uploadedFilePath });
      });

      busboy.on('error', (err: any) => reject(err));

      req.pipe(busboy);
    });
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers['content-type']?.includes('multipart/form-data')) {
        throw new BadRequestError('Content-Type must be multipart/form-data');
      }

      const { fields, filePath } = await this.parseMultipart(req);

      // Parse genres back to array if needed (Busboy might give string or array)
      // If it is a string "id1", and we expect array, we wrap it.
      // But typically we should parse it.
      // NOTE: Busboy fields are strings.
      // If multiple fields with same name 'genres', we handled it in 'field' event to make array.
      // But if user sends 'genres[]', busboy sees 'genres[]'.
      // We need to normalize.

      // Let's assume clients send 'genres' multiple times or JSON stringified.
      // For simplicity, let's try to parse if it looks like JSON array, or handle busboy array.

      let genres = fields.genres;
      if (typeof genres === 'string') {
          // Attempt to parse JSON
          try {
              genres = JSON.parse(genres);
          } catch {
              genres = [genres];
          }
      }
      if (!genres) genres = [];
      fields.genres = genres;

      const validated = createVideoSchema.safeParse(fields);
      if (!validated.success) {
        if (filePath) await fs.remove(filePath); // Cleanup
        throw new ValidationError('Invalid input', validated.error.issues);
      }

      const video = await this.videoService.create(validated.data, filePath);
      res.status(201).json({ success: true, data: video });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let data = req.body;
      let filePath: string | undefined;

      if (req.headers['content-type']?.includes('multipart/form-data')) {
        const result = await this.parseMultipart(req);
        data = result.fields;
        filePath = result.filePath;

        // Normalize genres again if present
        if (data.genres) {
            let genres = data.genres;
             if (typeof genres === 'string') {
                try {
                    genres = JSON.parse(genres);
                } catch {
                    genres = [genres];
                }
            }
            data.genres = genres;
        }
      }

      const validated = updateVideoSchema.safeParse(data);
      if (!validated.success) {
         if (filePath) await fs.remove(filePath);
         throw new ValidationError('Invalid input', validated.error.issues);
      }

      const video = await this.videoService.update(req.params.id, validated.data, filePath);
      res.json({ success: true, data: video });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.videoService.delete(req.params.id);
      res.json({ success: true, message: 'Video deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
