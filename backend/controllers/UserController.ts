import {Controller} from "./Controller";
import {userService, UserService} from "../service/UserService";
import {Request, Response} from "express";
import {languageService} from "../service/LanguageService";
import {LP_User} from "../src/entity/User/LP_User";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";

/*
    TODO:
    0. Poder ver el perfil de me con mi info publica (nombre, mail, foto, idiomas que conozco y que quiero aprender). DONE
    1. Poder ver el perfil de un usuario X con su info publica (nombre, mail, foto, idiomas que conoce y que quiere aprender). DONE
    2. Poder agregar con una sola API call multiples idiomas que conoce y que quiere aprender. DONE
    3. Poder remover con una sola API call multiples idiomas que conoce y que quiere aprender. DONE
    4. Poder actualizar el perfil de un usuario (City) y foto (opcional).
 */

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

    //Pre: Request body must contain a languageName field, which corresponds to an already existing language.
    //Post: Adds a known language to the user and returns 200 Ok if it was added successfully by service layer or error.
    public addKnownLanguages = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            const languagesNames = req.body.languageNames;
            const languages = await this.getLanguagesByName(languagesNames);

            await this.service.addKnownLanguagesToUser(userId, languages);
            this.okResponse(res, 'Languages added successfully');
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public addWantedLanguages = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            const languagesNames = req.body.languageNames;
            const languages = await this.getLanguagesByName(languagesNames);

            await this.service.addWantToKnowLanguagesToUser(userId, languages);
            this.okResponse(res, 'Languages added successfully');
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public removeKnownLanguages = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            const languagesNames = req.body.languageNames;
            const languages = await this.getLanguagesByName(languagesNames);

            await this.service.removeKnownLanguagesFromUser(userId, languages);
            this.okResponse(res, 'Languages removed successfully');
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public removeWantedLanguages = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            const languagesNames = req.body.languageNames;
            const languages = await this.getLanguagesByName(languagesNames);

            await this.service.removeWantToKnowLanguagesFromUser(userId, languages);
            this.okResponse(res, 'Languages removed successfully');
        } catch (error) {
            this.handleError(error, res);
        }
    }

    private getLanguagesByName = async (languagesNames: string[]) => {
        const languages = await languageService.getLanguagesByName(languagesNames);

        for (const language of languages) {
            if(!language) throw new InvalidArgumentsError(("Language " + language + " does is invalid."));
        }

        return languages;
    }
}

export default new UserController();