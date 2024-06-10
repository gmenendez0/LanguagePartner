import {Controller} from "./Controller";
import {SessionService} from "../service/SessionService";
import {NextFunction, Request, Response} from "express";
import {passportAuthenticate} from "../config/passportConfig";
import {TokenSessionStrategy} from "../service/sessionStrategy/TokenSessionStrategy";

class SessionController extends Controller {
    private service: SessionService;

    constructor() {
        super();
        this.service = new SessionService(new TokenSessionStrategy());
    }
    public register = async (req: Request, res: Response) => {
        try {
            const { city, name, email, password } = req.body;
            let user = await this.service.register(name, email, password, city);

            this.createdResponse(res, user);
        } catch (error) {
            this.handleError(error, res)
        }
    }
    public login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            const userToken = await this.service.login(email, password);

            this.okResponse(res, { success: true, message: "Login successful", token: userToken });
        } catch (error) {
            this.handleError(error, res)
        }
    }

    public authenticate = async (req: Request, res: Response, next: NextFunction) => {
        await passportAuthenticate(req, res, next);
    }
}

export default new SessionController();