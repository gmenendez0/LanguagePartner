import {Controller} from "./Controller";
import {sessionService, SessionService} from "../service/SessionService";
import {NextFunction, Request, Response} from "express";
import {passportAuthenticate} from "../config/passportConfig";
import {CreateLP_UserDTO} from "../DTOs/CreateLP_UserDTO";
import {plainToInstance} from "class-transformer";

class SessionController extends Controller {
    private service: SessionService;

    constructor() {
        super();
        this.service = sessionService;
    }

    /**
     * Delegates the request to the service to register a new user.
     * @param req - The Request object containing the user's information in the request body.
     * @param res - The Response object to send.
     */
    public register = async (req: Request, res: Response) => {
        try {
            const { city, name, email, password } = req.body;
            const userData = plainToInstance(CreateLP_UserDTO, { city, name, email, password });

            const user = await this.service.register(userData);

            this.createdResponse(res, user.asPublic());
        } catch (error) {
            this.handleError(error, res)
        }
    }

    /**
     * Delegates the request to the service to log in.
     * @param req - The Request object containing the user's email and password in the request body.
     * @param res - The Response object to send.
     */
    public login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            const userToken = await this.service.login(email, password);

            this.okResponse(res, { success: true, token: userToken });
        } catch (error) {
            this.handleError(error, res)
        }
    }

    /**
     * Delegates the request directly to the passportAuthenticate function to authenticate the user.
     * @param req - The Request object to authenticate.
     * @param res - The Response object to send.
     * @param next - The NextFunction to pass control to the next middleware.
     */
    public authenticate = async (req: Request, res: Response, next: NextFunction) => {
        await passportAuthenticate(req, res, next);
    }
}

export default new SessionController();