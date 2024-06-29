import { Router } from 'express';
import sessionController from "../controllers/SessionController";
import userController from "../controllers/UserController";

const userRouter = Router();

userRouter.get('/me', sessionController.authenticate, userController.getMe);
userRouter.get('/:id', userController.getUserPublicData);
userRouter.get('/me/is_configured', sessionController.authenticate, userController.meIsConfigured);

userRouter.patch('/me', sessionController.authenticate, userController.updateMe);
userRouter.patch('/me/configure', sessionController.authenticate, userController.configureMe);

export default userRouter;