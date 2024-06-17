import { Router } from 'express';
import ChatController from '../controllers/ChatController';

const chatRouter = Router();

chatRouter.post('/:id', ChatController.addMessage);
chatRouter.get('/:id', ChatController.getChat);

export default chatRouter;