import { Router } from 'express';
import { PlaylistController } from '../controllers/PlaylistController';
import { PlaylistRepository } from '../../../infrastructure/persistence/PlaylistRepository';
import { VideoRepository } from '../../../infrastructure/persistence/VideoRepository';
import { PlaylistService } from '../../../application/services/PlaylistService';

const playlistRepository = new PlaylistRepository();
const videoRepository = new VideoRepository();
const playlistService = new PlaylistService(playlistRepository, videoRepository);
const playlistController = new PlaylistController(playlistService);

const router = Router();

router.get('/', playlistController.getAll);
router.get('/:id', playlistController.getById);
router.post('/', playlistController.create);
router.put('/:id', playlistController.update);
router.delete('/:id', playlistController.delete);

export { router as playlistRouter };
