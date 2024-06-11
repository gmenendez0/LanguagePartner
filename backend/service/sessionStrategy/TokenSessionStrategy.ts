import {InvalidArgumentsError} from "../../errors/InvalidArgumentsError";
import {InvalidCredentialsError} from "../../errors/InvalidCredentialsError";
import {LP_User} from "../../src/entity/User/LP_User";
import {LP_SessionStrategy} from "./LP_SessionStrategy";
import * as jwt from "jsonwebtoken";
import {UserService} from "../UserService";

export class TokenSessionStrategy implements LP_SessionStrategy {
    public register = async (registerData: { email: string, password: string , name: string, city: string}, userService: UserService): Promise<void> => {
        const { city, name, email, password } = registerData;
        if (!city || !name || !email || !password) throw new InvalidArgumentsError('All fields (city, name, email and password) are required not empty.');

        await userService.createUser(name, email, password, city);
    }

    public logIn = async (logInData: { userEmail: string, userPassword: string }, userService: UserService): Promise<String> => {
        const { userEmail, userPassword } = logInData;
        if (!userEmail || !userPassword) throw new InvalidArgumentsError('Both email and password are required not empty.');

        let user: LP_User = await userService.getUserByEmail(userEmail);
        if (!user) throw new InvalidCredentialsError('User not found with given credentials.');
        if (!user.stringMatchesPassword(userPassword)) throw new InvalidCredentialsError('User not found with given credentials.');

        return this.generateJWTForUser(user);
    }

    public logOut = (_logOutData: { token: string }): Promise<null> => {
        // Esta funcion no sera implementada. El logOut no se implementa server-side en una aplicacion de API REST con JWT.
        return null;
    }

    // ! No utilizar!
    public authenticate = (_authenticateData: { token: string }): Promise<null> => {
        // Esta funcion no sera implementada. La aplicacion utiliza el metodo passportAuthenticate de passportConfig.ts para la autenticacion.
        // Se evita llamar a passport desde el servicio para evitar acoplar el servicio a express (passport y express van acoplados) y por lo tanto a un uso exclusivo de API.
        // Es por eso que, como esta clase esta pensada para utilizarse desde la capa de servicio, tambien se evita llamar a passport desde aqui.
        // Se delega la responsabilidad de autenticar al controlador.
        return null;
    }

    //Post: Returns a unique JWT token for the user.
    private generateJWTForUser = (user: LP_User) => {
        return jwt.sign({id: user.getId}, "your_jwt_secret_key", {expiresIn: "1h"}); //TODO Reemplazar secretKey por una variable de entorno, expiresIn debe ser CONST.
    }
}
