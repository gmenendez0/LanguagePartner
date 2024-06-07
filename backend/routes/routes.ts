import { Router } from 'express';
/*import * as userController from '../controllers/userController';
import * as matchingController from '../controllers/matchingController';
import * as imageController from '../controllers/imageController';*/
import languageRouter from "./languageRoutes";
import sessionRouter from "./sessionRoutes";

const router = Router();

/*router.post('/add-known-language', userController.addKnownLanguage);
router.post('/add-wanted-language', userController.addWantedLanguage);
router.delete('/remove-known-language', userController.removeKnownLanguage);
router.delete('/remove-wanted-language', userController.removeWantedLanguage);
router.get('/my-languages', userController.myLanguages);

router.get('/matchable-user', matchingController.getMatchableUser);
router.post('/approve-user', matchingController.approveUser);
router.post('/reject-user', matchingController.rejectUser);
router.get('/relationships', matchingController.getRelationships);

router.post('/upload-profile-picture', imageController.uploadMiddleware,  imageController.uploadProfilePicture);
router.delete('/delete-profile-picture', imageController.deleteProfilePicture);
router.get('/profile-picture', imageController.getProfilePicture);*/

router.use('/v1/session', sessionRouter);
router.use('/v1/language', languageRouter);

export default router;
