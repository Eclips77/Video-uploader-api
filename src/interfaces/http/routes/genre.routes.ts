import { Router } from 'express';
import { GenreController } from '../controllers/GenreController';
import { GenreService } from '../../../application/services/GenreService';
import { container } from '../../../container';

const genreService = new GenreService(container.genreRepository);
const genreController = new GenreController(genreService);

const router = Router();

router.get('/', genreController.getAll);
router.get('/:id', genreController.getById);
router.post('/', genreController.create);
router.put('/:id', genreController.update);
router.delete('/:id', genreController.delete);

export { router as genreRouter };
