import { Router } from 'express';
import sessionController from "../controllers/SessionController";
import userController from "../controllers/UserController";

const userRouter = Router();

userRouter.get('me', sessionController.authenticate, userController.getMe);

export default userRouter;