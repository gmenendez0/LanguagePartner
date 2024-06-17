import {Controller} from "./Controller";
import {userService, UserService} from "../service/UserService";
import {Request, Response} from "express";
import {languageService} from "../service/LanguageService";
import {LP_User} from "../src/entity/User/LP_User";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";

export class UserController extends Controller {
    private service: UserService;

    constructor() {
        super();
        this.service = userService;
    }

    //Post: Returns 200 Ok and the user object (only public data) if the user was retrieved successfully by service layer or error.
    public getUserPublicData = async (req: Request, res: Response) => {
        try {
            const user = await this.service.getUserPublicDataById(Number(req.params.id));
            this.okResponse(res, user);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    //Post: Returns 200 Ok and the loggedIn user object if it was retrieved successfully by service layer or error.
    public getMe = async (req: Request, res: Response) => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        await this.getUserPublicData(req, res);
    }

    public addMeKnownLanguages = async (req: Request, res: Response) => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        await this.addKnownLanguages(req, res);
    }

    public addMeWantedLanguages = async (req: Request, res: Response) => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        await this.addWantedLanguages(req, res);
    }

    public removeMeKnownLanguages = async (req: Request, res: Response) => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        await this.removeKnownLanguages(req, res);
    }

    public removeMeWantedLanguages = async (req: Request, res: Response) => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        await this.removeWantedLanguages(req, res);
    }

    //Pre: Request body must contain a languageName field, which corresponds to an already existing language.
    //Post: Adds a known language to the user and returns 200 Ok if it was added successfully by service layer or error.
    private addKnownLanguages = async (req: Request, res: Response) => {
        await this.executeLanguagesOperation(req, res, this.service.addKnownLanguagesToUser);
    }

    private addWantedLanguages = async (req: Request, res: Response) => {
        await this.executeLanguagesOperation(req, res, this.service.addWantToKnowLanguagesToUser);
    }

    private removeKnownLanguages = async (req: Request, res: Response) => {
        await this.executeLanguagesOperation(req, res, this.service.removeKnownLanguagesFromUser);
    }

    private removeWantedLanguages = async (req: Request, res: Response) => {
        await this.executeLanguagesOperation(req, res, this.service.removeWantToKnowLanguagesFromUser);
    }

    private getAuthenticatedUserIdFromRequest = (req: Request) => {
        return (req.user as LP_User).getId();
    }

    private executeLanguagesOperation = async (req: Request, res: Response, operation: (userId: number, languages: any) => Promise<any>) => {
        try {
            const userId = Number(req.params.id);
            const languagesNames = req.body.languageName;

            this.validateLanguageNames(languagesNames)
            const languages = await this.getLanguagesByName(languagesNames);

            await operation(userId, languages);
            this.noContentResponse(res);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    private validateLanguageNames = (languageNames: string[]) => {
        if (!languageNames || languageNames.length === 0) throw new InvalidArgumentsError('No languages provided.');
        if (languageNames.every(str => typeof str === 'string' && str.trim().length > 0)) throw new InvalidArgumentsError('Each language in the array must be a non-empty string.');
    }

    private getLanguagesByName = async (languagesNames: string[]) => {
        const languages = await languageService.getLanguagesByName(languagesNames);

        for (let languageName of languagesNames) {
            if (!languages.some(language => language.getName() === languageName)) throw new InvalidArgumentsError(`Language with name ${languageName} is invalid.`);
        }

        return languages;
    }
}

export default new UserController();