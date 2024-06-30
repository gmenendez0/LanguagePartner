import {InvalidCredentialsError} from "../../errors/InvalidCredentialsError";
import {LP_User} from "../../entity/LP_User/LP_User";
import {LP_SessionStrategy} from "./LP_SessionStrategy";
import * as jwt from "jsonwebtoken";
import {UserService} from "../UserService";
import {CreateLP_UserDTO} from "../../DTOs/UserDTOs/CreateLP_UserDTO";
import {LogInDTO} from "../../DTOs/SessionDTOs/LogInDTO";
import {JWT_SECRET, JWT_EXPIRATION_TIME} from "../../config/constants";

export class TokenSessionStrategy implements LP_SessionStrategy {
    /**
     * @inheritdoc
     */
    public register = async (registerData: CreateLP_UserDTO, userService: UserService): Promise<LP_User> => {
        return await userService.createUser(registerData);
    }

    /**
     * @inheritdoc
     */
    public logIn = async (logInData: LogInDTO, userService: UserService): Promise<String> => {
        await logInData.validate();

        let user: LP_User = await userService.getUserByEmail(logInData.email);
        if (!user) throw new InvalidCredentialsError('LP_User not found with given credentials.');
        if (!user.stringMatchesPassword(logInData.password)) throw new InvalidCredentialsError('LP_User not found with given credentials.');

        return this.generateJWTForUser(user);
    }

    /**
     * @inheritdoc
     */
    public logOut = (_logOutData: { token: string }): Promise<null> => {
        // Esta funcion no sera implementada. El logOut no se implementa server-side en una aplicacion de API REST con JWT.
        return null;
    }

    /**
     * @inheritdoc
     */
    public authenticate = (_authenticateData: { token: string }): Promise<null> => {
        // Esta funcion no sera implementada. La aplicacion utiliza el metodo passportAuthenticate de passportConfig.ts para la autenticacion.
        // Se evita llamar a passport desde el servicio para evitar acoplar el servicio a express (passport y express van acoplados) y por lo tanto a un uso exclusivo de API.
        // Es por eso que, como esta clase esta pensada para utilizarse desde la capa de servicio, tambien se evita llamar a passport desde aqui.
        // Se delega la responsabilidad de autenticar al controlador.
        return null;
    }

    //Post: Returns a unique JWT token for the user.
    private generateJWTForUser = (user: LP_User) => {
        return jwt.sign({userId: user.getId()}, JWT_SECRET, {expiresIn: JWT_EXPIRATION_TIME});
    }
}
