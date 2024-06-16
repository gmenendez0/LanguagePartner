import {Controller} from "./Controller";
import {userService, UserService} from "../service/UserService";
import {Request, Response} from "express";
import {languageService} from "../service/LanguageService";
import {LP_User} from "../src/entity/User/LP_User";

export class UserController extends Controller {
    private service: UserService;

    constructor() {
        super();
        this.service = userService;
    }

    //Post: Returns 200 Ok and the user object if the user was retrieved successfully by service layer or error.
    private getUser = async (req: Request, res: Response) => {
        try {
            const user = await this.service.getUserById(Number(req.params.id));
            this.okResponse(res, user);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    //Post: Returns 200 Ok and the user object (only public data) if the user was retrieved successfully by service layer or error.
    private getUserPublicData = async (req: Request, res: Response) => {
        try {
            const user = await this.service.getUserPublicDataById(Number(req.params.id));
            this.okResponse(res, user);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    //Post: Returns 200 Ok and the loggedIn user object if it was retrieved successfully by service layer or error.
    public getMe = async (req: Request, res: Response) => {
        const user = req.user as LP_User;

        req.params.id = user.getId().toString();
        await this.getUserPublicData(req, res);
    }

    //Post: Returns 200 Ok and the users known languages list if it was retrieved successfully by service layer or error.
    public getUserKnownLanguages = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const languages = await this.service.getKnownLanguagesFromUser(id);
            this.okResponse(res, languages);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    //Post: Returns 200 Ok and the users wanted languages list if it was retrieved successfully by service layer or error.
    public getUserWantedLanguages = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const languages = await this.service.getWantToKnowLanguagesFromUser(id);
            this.okResponse(res, languages);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    //Pre: Request body must contain a languageName field, which corresponds to an already existing language.
    //Post: Adds a known language to the user and returns 200 Ok if it was added successfully by service layer or error.
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

    //Pre: Request body must contain a languageName field, which corresponds to an already existing language.
    //Post: Adds a wanted to learn language to the user and returns 200 Ok if it was added successfully by service layer or error.
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

    //Pre: Request body must contain a languageName field, which corresponds to an already existing language.
    //Post: Removes a known language from the user and returns 200 Ok if it was removed successfully by service layer or error.
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

    //Pre: Request body must contain a languageName field, which corresponds to an already existing language.
    //Post: Removes a wanted to learn language from the user and returns 200 Ok if it was removed successfully by service layer or error.
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

    //Pre: There must be a Language created with name = languageName.
    //Post: Returns the language object if it was retrieved successfully by service layer, otherwise returns null.
    private getLanguageByName = async (languageName: string) => {
        return await languageService.getLanguageByName(languageName);
    }
}

export default new UserController();