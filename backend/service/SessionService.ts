import {UserRepository, userRepository} from "../src/repository/UserRepository";
import {LP_SessionStrategy} from "./sessionStrategy/LP_SessionStrategy";

export class SessionService {
    private readonly repository: UserRepository;
    private strategy: LP_SessionStrategy;

    constructor(strategy: LP_SessionStrategy) {
        this.repository = userRepository;
        this.strategy = strategy;
    }

    //Pre: Receives the name, email, password and city of the user, all not empty.
    //Post: Delegates register to strategy.
    public register = async (name: string, email: string, password: string, city: string) => {
        await this.strategy.register({name, email, password, city}, this.repository);
    }

    //Pre: Receives the email and password of the user, both not empty.
    //Post: Delegates logIn to strategy.
    public login = async (userEmail: string, userPassword: string) => {
        return this.strategy.logIn({userEmail, userPassword}, this.repository);
    }
}