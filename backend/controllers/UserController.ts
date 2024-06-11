import {Controller} from "./Controller";
import {UserService} from "../service/UserService";
import {Request, Response} from "express";
import {languageService} from "../service/LanguageService";

export class UserController extends Controller {
    private service: UserService;

    constructor() {
        super();
        this.service = new UserService();
    }

    private getUser = async (req: Request, res: Response) => {
        try {
            const user = await this.service.getUserById(Number(req.params.id));
            this.okResponse(res, user);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public getMe = async (req: Request, res: Response) => {
        req.params.id = req.user.getId().toString();
        await this.getUser(req, res);
    }

    public getUserKnownLanguages = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const languages = await this.service.getKnownLanguagesFromUser(id);
            this.okResponse(res, languages);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public getUserWantedLanguages = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const languages = await this.service.getWantToKnowLanguagesFromUser(id);
            this.okResponse(res, languages);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public addKnownLanguage = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const language = await this.getLanguageByName(req.body.languageName);
            await this.service.addKnownLanguageToUser(id, language);

            this.okResponse(res, 'Language added successfully');
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public addWantedLanguage = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const language = await this.getLanguageByName(req.body.languageName);
            await this.service.addWantToKnowLanguageToUser(id, language);

            this.okResponse(res, 'Language added successfully');
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public removeKnownLanguage = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const language = await this.getLanguageByName(req.body.languageName);
            await this.service.removeKnownLanguageFromUser(id, language);

            this.okResponse(res, 'Language removed successfully');
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public removeWantedLanguage = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const language = await this.getLanguageByName(req.body.languageName);
            await this.service.removeWantToKnowLanguageFromUser(id, language);

            this.okResponse(res, 'Language removed successfully');
        } catch (error) {
            this.handleError(error, res);
        }
    }

    private getLanguageByName = async (languageName: string) => {
        return await languageService.getLanguageByName(languageName);
    }
}

export default new UserController();