import {Repository} from "typeorm";
import {User} from "../src/entity/User";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {UserRepository, userRepository} from "../src/repository/UserRepository";
import { hashString, compareHashedString, generateJWTForUser } from '../src/helpers/helpers';


export class SessionService {
    private repository: UserRepository;

    constructor() {
        this.repository = userRepository;
    }

    //Pre: Receives the name, email, password and city of the user, all not empty.
    //Post: If the email is not already in use, registers the user in the database.
    public register = async (name: string, email: string, password: string, city: string) => {
        if (!city || !name || !email || !password) throw new InvalidArgumentsError('All fields (city, name, email and password) are required not empty.');
        if (await this.repository.findByEmail(email)) throw new InvalidCredentialsError('Email already in use.');

        const hashedPassword = hashString(password);
        const newUser = new User(name, email, hashedPassword, city);

        await this.repository.saveUser(newUser);
    }

    //Pre: Receives the email and password of the user, both not empty.
    //Post: Returns a JWT token if the user exists in the database and the password is correct, otherwise throws an error.
    public login = async (userEmail: string, userPassword: string) => {
        if (!userEmail || !userPassword) throw new InvalidArgumentsError('Both email and password are required not empty.');

        let user: User = await this.repository.findByEmail(userEmail);
        if (!user) throw new InvalidCredentialsError('User not found with given credentials.');
        if (!compareHashedString(userPassword, user.getPassword())) throw new InvalidCredentialsError('User not found with given credentials.');

        return generateJWTForUser(user);
    }

    public logout = (req, res) => {
        // code here
    }
}