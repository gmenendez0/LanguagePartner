import { Router } from 'express';
import sessionController from "../controllers/SessionController";
import matchController from "../controllers/MatchController";

const matchRouter = Router();

matchRouter.get('/me/:amount', sessionController.authenticate, matchController.getMeMatchableUsers);

export default matchRouter;