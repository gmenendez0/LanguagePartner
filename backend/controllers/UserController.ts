import {Controller} from "./Controller";
import {userService, UserService} from "../service/UserService";
import {Request, Response} from "express";
import {LP_User} from "../src/entity/User/LP_User";
import {UpdateLPUserPublicDataDTO} from "../DTOs/UserDTOs/UpdateLPUserDTO";

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

    private updateUserPublicData = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            const userData = this.convertBodyToDTO(req, UpdateLPUserPublicDataDTO);

            const user = await this.service.updateUserPublicData(userId, userData);
            this.okResponse(res, user.asPublicDTO());
        } catch (error) {
            this.handleError(error, res);
        }
    }

    //Post: Returns 200 Ok and the loggedIn user object if it was retrieved successfully by service layer or error.
    public getMe = async (req: Request, res: Response) => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req);
        await this.getUserPublicData(req, res);
    }

    public updateMe = async (req: Request, res: Response) => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req);
        await this.updateUserPublicData(req, res);
    }
}

export default new UserController();