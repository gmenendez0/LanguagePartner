import { Router } from 'express';
import languageRouter from "./languageRoutes";
import sessionRouter from "./sessionRoutes";
import userRouter from "./userRoutes";
import chatRouter from './chatRoutes';
import matchingRouter from './matchingRoutes';

const router = Router();

router.use('/v1/session', sessionRouter);
router.use('/v1/language', languageRouter);
router.use('/v1/user', userRouter);
router.use('/v1/chat', chatRouter);
router.use('/v1/matching', matchingRouter);

export default router;
