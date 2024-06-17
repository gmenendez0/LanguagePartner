import {UserService} from "../UserService";
import {CreateLP_UserDTO} from "../../DTOs/CreateLP_UserDTO";

//Se agrega LP_ al nombre de la interfaz para indicar que es una interfaz nativa de LanguagePartner y evitar chocar con otras entidades de otras librerias.
export interface LP_SessionStrategy {

    /**
     * Registers a user in the repository.
     * @param registerData - The data of the user to register.
     * @param userService - The UserService instance.
     * @returns A promise that resolves with the result of the registration operation.
     */
    register(registerData: CreateLP_UserDTO, userService: UserService): Promise<unknown>;

    /**
     * Logs the user in.
     * @param logInData - The data of the user to log in. The schema must be defined by the subclass that implements this method.
     * @param userService - The UserService instance.
     * @returns A promise that resolves with the result of the login operation.
     */
    logIn(logInData: unknown, userService: UserService): Promise<unknown>;

    /**
     * Logs the user out.
     * @param logOutData - The data of the user to log out. The schema must be defined by the subclass that implements this method.
     * @returns A promise that resolves with the result of the logout operation.
     */
    logOut(logOutData: unknown): Promise<unknown>;

    /**
     * Authenticates the user.
     * @param authenticateData - The data of the user to authenticate. The schema must be defined by the subclass that implements this method.
     * @returns A promise that resolves with the result of the authentication operation.
     */
    authenticate(authenticateData: unknown): Promise<unknown>;
}