import {Controller} from "./Controller";
import {SessionService} from "../service/SessionService";
import {InvalidRequestFormatError} from "../errors/InvalidRequestFormatError";
import {Request, Response} from "express";

class SessionController extends Controller {
    private service: SessionService;

    constructor() {
        super();
        this.service = new SessionService();
    }
    public register = async (req: Request, res: Response) => {
        try {
            const { city, name, email, password } = req.body;
            if(!city || !name || !email || !password) throw new InvalidRequestFormatError('All fields (city, name, email and password) are required not empty.');

            await this.service.register(name, email, password, city);

            this.createdResponse(res, { message: 'User registered successfully.' });
        } catch (error) {
            this.handleError(error, res)
        }
    }
    public login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            if (!email || !password) throw new InvalidRequestFormatError('Both email and password are required not empty.');

            const userToken = await this.service.login(email, password);

            this.okResponse(res, { token: userToken });
        } catch (error) {
            this.handleError(error, res)
        }
    }

    public logout = (req: Request, res: Response) => {
        // code here
    }
}

export default new SessionController();