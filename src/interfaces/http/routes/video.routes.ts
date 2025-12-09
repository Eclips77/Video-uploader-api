import { Router } from 'express';
import { VideoController } from '../controllers/VideoController';
import { VideoRepository } from '../../../infrastructure/persistence/VideoRepository';
import { GenreRepository } from '../../../infrastructure/persistence/GenreRepository';
import { VideoService } from '../../../application/services/VideoService';
import { EncodingService } from '../../../infrastructure/encoding/EncodingService';

const videoRepository = new VideoRepository();
const genreRepository = new GenreRepository();
const encodingService = new EncodingService();
const videoService = new VideoService(videoRepository, genreRepository, encodingService);
const videoController = new VideoController(videoService);

const router = Router();

router.get('/', videoController.getAll);
router.get('/:id', videoController.getById);
router.post('/', videoController.create);
router.put('/:id', videoController.update);
router.delete('/:id', videoController.delete);

export { router as videoRouter };
