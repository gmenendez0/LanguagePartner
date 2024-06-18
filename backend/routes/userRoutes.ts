import { Router } from 'express';
import sessionController from "../controllers/SessionController";
import userController from "../controllers/UserController";

const userRouter = Router();

userRouter.get('/me', sessionController.authenticate, userController.getMe);
userRouter.get('/:id', userController.getUserPublicData);
userRouter.patch('/me', sessionController.authenticate, userController.updateMe);

export default userRouter;