import { Router } from 'express';
import SessionController from '../controllers/SessionController';
import { uploadProfilePicture, uploadMiddleware } from '../controllers/old/imageController';

const imageRouter = Router();

imageRouter.post('', uploadMiddleware, SessionController.authenticate, uploadProfilePicture);

export default imageRouter;