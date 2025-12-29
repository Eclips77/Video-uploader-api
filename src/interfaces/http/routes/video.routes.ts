import { Router } from 'express';
import { VideoController } from '../controllers/VideoController';
import { VideoService } from '../../../application/services/VideoService';
import { EncodingService } from '../../../infrastructure/encoding/EncodingService';
import { container } from '../../../container';

const encodingService = new EncodingService(container.storageService);
const videoService = new VideoService(container.videoRepository, container.genreRepository, encodingService, container.storageService);
const videoController = new VideoController(videoService);

const router = Router();

router.get('/', videoController.getAll);
router.get('/:id', videoController.getById);
router.post('/', videoController.create);
router.put('/:id', videoController.update);
router.delete('/:id', videoController.delete);

export { router as videoRouter };
