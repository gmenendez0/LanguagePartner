import { Router } from 'express';
import sessionController from "../controllers/SessionController";
import userController from "../controllers/UserController";

const userRouter = Router();

userRouter.get('/me', sessionController.authenticate, userController.getMe);
userRouter.get('/:id', userController.getUserPublicData);
userRouter.post('/me/known-languages', sessionController.authenticate, userController.addMeKnownLanguages);
userRouter.post('/me/wanted-languages', sessionController.authenticate, userController.addMeWantedLanguages);
userRouter.delete('/me/known-languages', sessionController.authenticate, userController.removeMeKnownLanguages);
userRouter.delete('/me/wanted-languages', sessionController.authenticate, userController.removeMeWantedLanguages);

export default userRouter;