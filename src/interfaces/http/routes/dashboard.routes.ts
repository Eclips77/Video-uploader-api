import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { container } from '../../../container';

const dashboardController = new DashboardController(container.videoRepository, container.genreRepository, container.playlistRepository);

const router = Router();

router.get('/stats', dashboardController.getStats);

export { router as dashboardRouter };
