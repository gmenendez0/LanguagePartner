import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as sessionController from '../controllers/sessionController';

const router = Router();

router.post('/login', sessionController.login);
router.post('/logout', sessionController.logout);
router.get('/current-user', sessionController.me);
router.post('/register', sessionController.register);

router.post('/add-known-language', userController.AddKnownLanguage);
router.post('/add-wanted-language', userController.AddWantedLanguage);
router.delete('/remove-known-language', userController.RemoveKnownLanguage);
router.delete('/remove-wanted-language', userController.RemoveWantedLanguage);

export default router;
