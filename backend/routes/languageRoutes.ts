import { Router } from 'express';
import languageService from "../service/LanguageService";

const languageRouter = Router();

languageRouter.post('/language', languageService.createLanguage);

export default languageRouter;