import { Router } from 'express';
import languageController from "../controllers/LanguageController";
import sessionController from "../controllers/SessionController";

const languageRouter = Router();

languageRouter.post('', sessionController.authenticate, languageController.createLanguage);

export default languageRouter;