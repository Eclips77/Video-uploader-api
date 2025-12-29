import { Router } from 'express';
import { PlaylistController } from '../controllers/PlaylistController';
import { PlaylistService } from '../../../application/services/PlaylistService';
import { container } from '../../../container';

const playlistService = new PlaylistService(container.playlistRepository, container.videoRepository);
const playlistController = new PlaylistController(playlistService);

const router = Router();

router.get('/', playlistController.getAll);
router.get('/:id', playlistController.getById);
router.post('/', playlistController.create);
router.put('/:id', playlistController.update);
router.delete('/:id', playlistController.delete);

export { router as playlistRouter };
