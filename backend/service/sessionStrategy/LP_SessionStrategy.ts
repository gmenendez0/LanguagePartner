import {UserRepository} from "../../src/repository/UserRepository";

//Se agrega LP_ al nombre de la interfaz para indicar que es una interfaz nativa de LanguagePartner y evitar chocar con otras entidades de otras librerias.
export interface LP_SessionStrategy {

    //registerData schema must be defined by the subclass that implements this method.
    //Pre: Receives the data of the user to register and the repository. Data must match the schema set by the subclass that implements this method.
    //Post: Registers the user in the repository.
    register(registerData: unknown, userRepository: UserRepository): Promise<unknown>;

    //registerData schema must be defined by the subclass that implements this method.
    //Pre: Receives the data of the user to logIn and the repository. Data must match the schema set by the subclass that implements this method.
    //Post: Logs the user in.
    logIn(logInData: unknown, userRepository: UserRepository): Promise<unknown>;

    //registerData schema must be defined by the subclass that implements this method.
    //Pre: Receives the data of the user to logOut. Data must match the schema set by the subclass that implements this method.
    //Post: Logs the user out.
    logOut(logOutData: unknown): Promise<unknown>;

    //registerData schema must be defined by the subclass that implements this method.
    //Pre: Receives the data of the user to authenticate. Data must match the schema set by the subclass that implements this method.
    //Post: Authenticates the user.
    authenticate(authenticateData: unknown): Promise<unknown>;
}