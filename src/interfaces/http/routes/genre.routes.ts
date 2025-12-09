import { Router } from 'express';
import { GenreController } from '../controllers/GenreController';
import { GenreRepository } from '../../../infrastructure/persistence/GenreRepository';
import { GenreService } from '../../../application/services/GenreService';

const genreRepository = new GenreRepository();
const genreService = new GenreService(genreRepository);
const genreController = new GenreController(genreService);

const router = Router();

router.get('/', genreController.getAll);
router.get('/:id', genreController.getById);
router.post('/', genreController.create);
router.put('/:id', genreController.update);
router.delete('/:id', genreController.delete);

export { router as genreRouter };
