import { Router } from 'express';
import languageController from "../controllers/LanguageController";

const languageRouter = Router();

languageRouter.post('/language', languageController.createLanguage);

export default languageRouter;