import {Service} from "./Service";
import {Request, Response} from "express";
import {LanguageController} from "../controllers/languageController";
import {InvalidRequestFormatError} from "../errors/InvalidRequestFormatError";

class LanguageService extends Service {
    private controller: LanguageController;

    constructor() {
        super();
        this.controller = new LanguageController();
    }

    //Pre: Request body must contain a languageName field.
    //Post: Creates a new Language with the given name.
    public async createLanguage(req: Request, res: Response) {
        try {
            if (!req.body.languageName) throw new InvalidRequestFormatError('Language name field is missing.');
            await this.controller.createLanguage(req.body.languageName);
        } catch (error) {
            this.handleError(error, res);
        }

        this.createdResponse(res, 'Language created successfully.');
    }
}

export default new LanguageService();