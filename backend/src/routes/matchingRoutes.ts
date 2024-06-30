import { Router } from 'express';
import SessionController from '../controllers/SessionController';
import { rejectUser, approveUser, getMatchableUser } from '../controllers/old/matchingController';

const matchingRouter = Router();

matchingRouter.get('', SessionController.authenticate, getMatchableUser);

matchingRouter.post('/reject/:id', SessionController.authenticate, rejectUser);
matchingRouter.post('/approve/:id', SessionController.authenticate, approveUser);

export default matchingRouter;