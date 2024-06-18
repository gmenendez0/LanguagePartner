import {userService, UserService} from "./UserService";

export class MatchService {
    private userService: UserService;

    constructor() {
        this.userService = userService;
    }

    public getMatchableUsers(userId: number, max: number) {
        return this.userService.getMatchableUsers(userId, max);
    }
}

export default new MatchService();