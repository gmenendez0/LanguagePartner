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
        const { city, name, email, password } = req.body;

        try {
            if(!city || !name || !email || !password) throw new InvalidRequestFormatError('All fields (city, name, email and password) are required not empty.');
            await this.service.register(name, email, password, city);

            this.createdResponse(res, 'User registered successfully.');
        } catch (error) {
            this.handleError(error, res)
        }
    }

    public login = (req: Request, res: Response) => {
        // code here
    }

    public logout = (req: Request, res: Response) => {
        // code here
    }

    public me = (req: Request, res: Response) => {
        // code here
    }
}