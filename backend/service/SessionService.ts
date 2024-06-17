import {LP_SessionStrategy} from "./sessionStrategy/LP_SessionStrategy";
import {userService, UserService} from "./UserService";
import {TokenSessionStrategy} from "./sessionStrategy/TokenSessionStrategy";
import {CreateLP_UserDTO} from "../DTOs/CreateLP_UserDTO";

export class SessionService {
    private readonly service: UserService;
    private strategy: LP_SessionStrategy;

    constructor(strategy: LP_SessionStrategy) {
        this.service = userService;
        this.strategy = strategy;
    }

    /**
     * Delegates user registration to the authentication strategy.
     * @param userData - The user data.
     * @throws {Error} If any of the parameters (name, email, password, city) inside userData are empty or are no strings.
     */
    public register = async (userData: CreateLP_UserDTO) => {
        return await this.strategy.register(userData, this.service);
    }

    /**
     * Delegates user login to the authentication strategy.
     * @param userEmail - The email address of the user.
     * @param userPassword - The password of the user.
     * @returns A promise that resolves with the result of the login operation.
     * @throws {Error} If either userEmail or userPassword is empty.
     */
    public login = async (userEmail: string, userPassword: string) => {
        return this.strategy.logIn({userEmail, userPassword}, this.service);
    }
}

export const sessionService = new SessionService(new TokenSessionStrategy());