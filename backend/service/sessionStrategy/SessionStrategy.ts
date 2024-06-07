import {User} from "../../src/entity/User";
import {InvalidArgumentsError} from "../../errors/InvalidArgumentsError";
import {compareHashedString, generateJWTForUser, hashString} from "../../src/helpers/helpers";
import {UserRepository} from "../../src/repository/UserRepository";
import {InvalidCredentialsError} from "../../errors/InvalidCredentialsError";

abstract class SessionStrategy {

    public abstract register(registerData: unknown, userRepository: UserRepository): Promise<unknown>;

    public abstract logIn(logInData: unknown, userRepository: UserRepository): Promise<unknown>;

    public abstract logOut(logOutData: unknown): void;

    public abstract authenticate(authenticateData: unknown): void;
}

class TokenSessionStrategy extends SessionStrategy {
    register = async (registerData: { email: string, password: string , name: string, city: string}, userRepository: UserRepository): Promise<void> => {
        const { city, name, email, password } = registerData;

        if (!city || !name || !email || !password) throw new InvalidArgumentsError('All fields (city, name, email and password) are required not empty.');
        if (await userRepository.findByEmail(email)) throw new InvalidCredentialsError('Email already in use.');

        const hashedPassword = hashString(password);
        const newUser = new User(name, email, hashedPassword, city);

        await userRepository.saveUser(newUser);
    }

    logIn = async (logInData: { userEmail: string, userPassword: string }, userRepository: UserRepository): Promise<String> => {
        const { userEmail, userPassword } = logInData;
        if (!userEmail || !userPassword) throw new InvalidArgumentsError('Both email and password are required not empty.');

        let user: User = await userRepository.findByEmail(userEmail);
        if (!user) throw new InvalidCredentialsError('User not found with given credentials.');
        if (!compareHashedString(userPassword, user.getPassword())) throw new InvalidCredentialsError('User not found with given credentials.');

        return generateJWTForUser(user);
    }

    logOut = (logOutData: { token: string }): void => {
        //TODO
    }

    // ! No utilizar!
    authenticate = (authenticateData: { token: string }): void => {
        // Esta funcion no sera implementada. La aplicacion utiliza el metodo passportAuthenticate de passportConfig.ts.
        // Se evita llamar a passport desde el servicio para evitar acoplar el servicio a express (passport y express van acoplados) y por lo tanto a un uso exclusivo de API.
        // Para eso, como esta clase esta pensada para utilizarse desde la capa de servicio, tambien se evita llamar a passport desde aqui.
        // Se delega la responsabilidad de autenticar al controlador.
    }
}