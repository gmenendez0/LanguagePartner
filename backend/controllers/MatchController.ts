import {Controller} from "./Controller";
import matchService, {MatchService} from "../service/MatchService";
import {Request, Response} from "express";

class MatchController extends Controller {
    private service: MatchService;

    constructor() {
        super();
        this.service = matchService;
    }

    public getMatchableUsers = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id;
            const max = req.params.amount;

            const matchableUsers = await this.service.getMatchableUsers(Number(userId), Number(max));
            const matchableUsersPublicDTO = matchableUsers.map((user) => user.asPublicDTO());

            this.okResponse(res, matchableUsersPublicDTO);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public getMeMatchableUsers = async (req: Request, res: Response) => {
        try {
            req.params.id = this.getAuthenticatedUserIdFromRequest(req);
            return this.getMatchableUsers(req, res);
        } catch (error) {
            this.handleError(error, res);
        }
    }
}

export default new MatchController();