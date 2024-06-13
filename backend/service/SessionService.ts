import {LP_SessionStrategy} from "./sessionStrategy/LP_SessionStrategy";
import {userService, UserService} from "./UserService";
import {TokenSessionStrategy} from "./sessionStrategy/TokenSessionStrategy";

export class SessionService {
    private readonly service: UserService;
    private strategy: LP_SessionStrategy;

    constructor(strategy: LP_SessionStrategy) {
        this.service = userService;
        this.strategy = strategy;
    }

    /**
     * Delegates user registration to the authentication strategy.
     * @param name - The name of the user.
     * @param email - The email address of the user.
     * @param password - The password of the user.
     * @param city - The city where the user resides.
     * @throws {Error} If any of the parameters (name, email, password, city) are empty.
     */
    public register = async (name: string, email: string, password: string, city: string) => {
        await this.strategy.register({name, email, password, city}, this.service);
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