import {UserRepository} from "../../src/repository/UserRepository";
import {InvalidArgumentsError} from "../../errors/InvalidArgumentsError";
import {InvalidCredentialsError} from "../../errors/InvalidCredentialsError";
import {User} from "../../src/entity/User";
import {LP_SessionStrategy} from "./LP_SessionStrategy";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export class TokenSessionStrategy implements LP_SessionStrategy {
    public register = async (registerData: { email: string, password: string , name: string, city: string}, userRepository: UserRepository): Promise<User> => {
        const { city, name, email, password } = registerData;

        if (!city || !name || !email || !password) throw new InvalidArgumentsError('All fields (city, name, email and password) are required not empty.');
        if (await userRepository.findByEmail(email)) throw new InvalidCredentialsError('Email already in use.');

        const hashedPassword = this.hashString(password);
        const newUser = new User(name, email, hashedPassword, city);

        return await userRepository.saveUser(newUser);
    }

    public logIn = async (logInData: { userEmail: string, userPassword: string }, userRepository: UserRepository): Promise<String> => {
        const { userEmail, userPassword } = logInData;
        if (!userEmail || !userPassword) throw new InvalidArgumentsError('Both email and password are required not empty.');

        let user: User = await userRepository.findByEmail(userEmail);
        if (!user) throw new InvalidCredentialsError('User not found with given credentials.');
        if (!this.compareHashedString(userPassword, user.getPassword())) throw new InvalidCredentialsError('User not found with given credentials.');

        return this.generateJWTForUser(user);
    }

    public logOut = (_logOutData: { token: string }): void => {
        // Esta funcion no sera implementada. El logOut no se implementa server-side en una aplicacion de API REST con JWT.
    }

    // ! No utilizar!
    public authenticate = (_authenticateData: { token: string }): void => {
        // Esta funcion no sera implementada. La aplicacion utiliza el metodo passportAuthenticate de passportConfig.ts para la autenticacion.
        // Se evita llamar a passport desde el servicio para evitar acoplar el servicio a express (passport y express van acoplados) y por lo tanto a un uso exclusivo de API.
        // Es por eso que, como esta clase esta pensada para utilizarse desde la capa de servicio, tambien se evita llamar a passport desde aqui.
        // Se delega la responsabilidad de autenticar al controlador.
    }

    //Post: Returns the hashed string.
    private hashString = (string: string) => {
        return bcrypt.hashSync(string, 10); //TODO Reemplazar 10 por una variable de entorno.
    }

//Post: Returns true if the string (hashed) and the hashed string match, otherwise returns false.
    private compareHashedString = (string: string, hashedString: string) => {
        return bcrypt.compareSync(string, hashedString);
    }

//Post: Returns a unique JWT token for the user.
    private generateJWTForUser = (user: User) => {
        return jwt.sign({id: user.getId}, "your_jwt_secret_key", {expiresIn: "1h"}); //TODO Reemplazar secretKey por una variable de entorno, expiresIn debe ser CONST.
    }
}
