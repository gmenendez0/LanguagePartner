import { Router } from 'express';
import languageService from "../controllers/LanguageController";

const languageRouter = Router();

languageRouter.post('/language', languageService.createLanguage);

export default languageRouter;