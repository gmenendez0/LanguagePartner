import {Controller} from "./Controller";
import {Request, Response} from "express";
import {LanguageService} from "../service/LanguageService";
import {InvalidRequestFormatError} from "../errors/InvalidRequestFormatError";

class LanguageController extends Controller {
    private service: LanguageService;

    constructor() {
        super();
        this.service = new LanguageService();
    }

    //Pre: Request body must contain a languageName field.
    //Post: Creates a new Language with the given name.
    public createLanguage = async (req: Request, res: Response) => {
        try {
            if (!req.body.languageName) throw new InvalidRequestFormatError('Language name field is missing.');
            await this.service.createLanguage(req.body.languageName);

            this.createdResponse(res, { message: 'Language created successfully.' });
        } catch (error) {
            this.handleError(error, res);
        }
    }
}

export default new LanguageController();