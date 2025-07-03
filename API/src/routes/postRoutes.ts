import { Router } from 'express';
import PostController from "../controllers/postController";
import path from "path";
import fs from "fs";
import multer from "multer";

const postController = new PostController();

const uploadDir = path.join(__dirname, '..', '..','..','Next_Door_Buddy','public', 'uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        cb(null, uploadDir)
    },
    filename: (_req, file, cb) => {
        const uniqueName = `post-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

const upload = multer({ storage:storage , limits: { fieldSize: 10 * 1024 * 1024 } })

const postRoutes = Router();
postRoutes.get('/', postController.getAll);
postRoutes.get('/:id', postController.getOne);
postRoutes.get('/neighborhood/:neighborhoodId', postController.getByNeighborhood);
postRoutes.post('/create', upload.array('images', 10), postController.create);
postRoutes.put('/:id', postController.modify);
postRoutes.delete('/:id', postController.delete);

export default postRoutes;
