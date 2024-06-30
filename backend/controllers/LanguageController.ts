import {Controller} from "./Controller";
import {Request, Response} from "express";
import {LanguageService} from "../service/LanguageService";
import {inject, injectable} from "inversify";
import {TYPES} from "../config/InversifyJSTypes";

@injectable()
class LanguageController extends Controller {
    @inject(TYPES.LanguageService) private service: LanguageService;

    /**
     * Creates a new Language with the given name.
     * @param req - The Request object containing the request body.
     * @param res - The Response object to send.
     * @throws {Error} If the request body does not contain a languageName field.
     */
    public createLanguage = async (req: Request, res: Response) => {
        try {
            await this.service.createLanguage(req.body.languageName);

            this.createdResponse(res, { message: 'Language created successfully.' });
        } catch (error) {
            this.handleError(error, res);
        }
    }
}

export default new LanguageController();