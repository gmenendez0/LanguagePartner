import {Controller} from "./Controller";
import {userService, UserService} from "../service/UserService";
import {Request, Response} from "express";
import {LP_User} from "../src/entity/LP_User/LP_User";
import {UpdateLP_UserPublicDataDTO} from "../DTOs/UserDTOs/UpdateLP_UserDTO";
import {ConfigureLP_UserDTO} from "../DTOs/UserDTOs/ConfigureLP_UserDTO";

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

    private updateUserPublicData = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            const userData = this.convertBodyToDTO(req, UpdateLP_UserPublicDataDTO);

            const user = await this.service.updateUserPublicData(userId, userData);
            this.okResponse(res, user.asPublicDTO());
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public updateMe = async (req: Request, res: Response) => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        await this.updateUserPublicData(req, res);
    }

    public userIsConfigured = (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            this.okResponse(res, this.service.userIsConfigured(userId));
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public meIsConfigured = async (req: Request, res: Response) => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        this.userIsConfigured(req, res);
    }

    public configureUser = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            const userConfig = this.convertBodyToDTO(req, ConfigureLP_UserDTO);

            const user = await this.service.configureUser(userId, userConfig);
            this.okResponse(res, user.asPublicDTO());
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public configureMe = async (req: Request, res: Response) => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        await this.configureUser(req, res);
    }

    private getAuthenticatedUserIdFromRequest = (req: Request) => {
        return (req.user as LP_User).getId();
    }
}

export default new UserController();