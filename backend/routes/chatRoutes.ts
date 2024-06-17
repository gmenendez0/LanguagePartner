import { Router } from 'express';
import ChatController from '../controllers/ChatController';
import SessionController from '../controllers/SessionController';

const chatRouter = Router();

chatRouter.post('/:id', SessionController.authenticate ,ChatController.addMessage);
chatRouter.get('/:id', SessionController.authenticate ,ChatController.getChat);

export default chatRouter;