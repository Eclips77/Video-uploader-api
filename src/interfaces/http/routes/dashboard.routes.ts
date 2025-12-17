import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { VideoRepository } from '../../../infrastructure/persistence/VideoRepository';
import { GenreRepository } from '../../../infrastructure/persistence/GenreRepository';
import { PlaylistRepository } from '../../../infrastructure/persistence/PlaylistRepository';

const videoRepo = new VideoRepository();
const genreRepo = new GenreRepository();
const playlistRepo = new PlaylistRepository();
const dashboardController = new DashboardController(videoRepo, genreRepo, playlistRepo);

const router = Router();

router.get('/stats', dashboardController.getStats);

export { router as dashboardRouter };
