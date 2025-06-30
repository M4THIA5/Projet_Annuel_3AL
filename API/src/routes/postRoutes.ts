import { Router } from 'express';
import PostController from "../controllers/postController";

const postController = new PostController();
const postRoutes = Router();

postRoutes.get('/', postController.getAll);
postRoutes.get('/:id', postController.getOne);
postRoutes.get('/neighborhood/:neighborhoodId', postController.getByNeighborhood);
postRoutes.post('/create', postController.create);
postRoutes.put('/:id', postController.modify);
postRoutes.delete('/:id', postController.delete);

export default postRoutes;
