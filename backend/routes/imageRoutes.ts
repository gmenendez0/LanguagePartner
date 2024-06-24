import { Router } from 'express';
import SessionController from '../controllers/SessionController';
import { uploadProfilePicture } from '../controllers/old/imageController';

const imageRouter = Router();

imageRouter.post('', SessionController.authenticate, uploadProfilePicture);

export default imageRouter;