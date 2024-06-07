import { Router } from 'express';
import sessionController from "../controllers/SessionController";

const sessionRouter = Router();

sessionRouter.post('/login', sessionController.login);
sessionRouter.post('/register', sessionController.register);

export default sessionRouter;