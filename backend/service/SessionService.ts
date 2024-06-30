import {LP_SessionStrategy} from "./sessionStrategy/LP_SessionStrategy";
import {UserService} from "./UserService";
import {CreateLP_UserDTO} from "../DTOs/UserDTOs/CreateLP_UserDTO";
import {LogInDTO} from "../DTOs/SessionDTOs/LogInDTO";
import {inject, injectable} from "inversify";
import {TYPES} from "../config/InversifyJSTypes";

@injectable()
export class SessionService {
    @inject(TYPES.UserService) private readonly service: UserService;
    @inject(TYPES.TokenSessionStrategy) private strategy: LP_SessionStrategy;

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
     * @param userData - The user data.
     * @returns A promise that resolves with the result of the login operation.
     * @throws {Error} If any of the parameters inside userData is empty.
     */
    public login = async (userData: LogInDTO) => {
        return this.strategy.logIn(userData, this.service);
    }
}