import {UserRepository} from "../../src/repository/UserRepository";
import {User} from "../../src/entity/User";

export interface LP_SessionStrategy {

    //registerData schema must be defined by the subclass that implements this method.
    //Pre: Receives the data of the user to register and the repository. Data must match the schema set by the subclass that implements this method.
    //Post: Registers the user in the repository.
    register(registerData: unknown, userRepository: UserRepository): Promise<User>;

    //registerData schema must be defined by the subclass that implements this method.
    //Pre: Receives the data of the user to logIn and the repository. Data must match the schema set by the subclass that implements this method.
    //Post: Logs the user in.
    logIn(logInData: unknown, userRepository: UserRepository): Promise<unknown>;

    //registerData schema must be defined by the subclass that implements this method.
    //Pre: Receives the data of the user to logOut. Data must match the schema set by the subclass that implements this method.
    //Post: Logs the user out.
    logOut(logOutData: unknown): void;

    //registerData schema must be defined by the subclass that implements this method.
    //Pre: Receives the data of the user to authenticate. Data must match the schema set by the subclass that implements this method.
    //Post: Authenticates the user.
    authenticate(authenticateData: unknown): void;
}