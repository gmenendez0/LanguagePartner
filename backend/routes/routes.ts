import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as sessionController from '../controllers/sessionController';
import * as matchingController from '../controllers/matchingController';
import * as imageController from '../controllers/imageController';

const router = Router();

router.post('/login', sessionController.login);
router.post('/logout', sessionController.logout);
router.get('/current-user', sessionController.me);
router.post('/register', sessionController.register);

router.post('/add-known-language', userController.addKnownLanguage);
router.post('/add-wanted-language', userController.addWantedLanguage);
router.delete('/remove-known-language', userController.removeKnownLanguage);
router.delete('/remove-wanted-language', userController.removeWantedLanguage);

router.get('/matchable-user', matchingController.getMatchableUser);
router.post('/approve-user', matchingController.approveUser);
router.post('/reject-user', matchingController.rejectUser);

router.post('/upload-profile-picture', imageController.uploadMiddleware,  imageController.uploadProfilePicture);
router.delete('/delete-profile-picture', imageController.deleteProfilePicture);

export default router;
