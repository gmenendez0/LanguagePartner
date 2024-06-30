import { Router } from 'express';
import sessionController from "../controllers/SessionController";
import userController from "../controllers/UserController";
import {multerUploadMiddleware} from "../config/multerConfig";

const userRouter = Router();

userRouter.get('/me', sessionController.authenticate, userController.getMe);
userRouter.get('/:id', userController.getUserPublicData);
userRouter.get('/me/config', sessionController.authenticate, userController.meIsConfigured);

userRouter.patch('/me', sessionController.authenticate, userController.updateMe);
userRouter.patch('/me/config', sessionController.authenticate, userController.configureMe);
userRouter.patch('/me/profile-pic', sessionController.authenticate, multerUploadMiddleware, userController.updateMeProfilePic);

export default userRouter;