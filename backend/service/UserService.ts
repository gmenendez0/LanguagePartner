import {UserRepository} from "../src/repository/UserRepository";
import {userRepository} from "../src/repository/UserRepository";
import {Language} from "../src/entity/Language/Language";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {LP_User} from "../src/entity/User/LP_User";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = userRepository;
    }

    public createUser = async (name: string, email: string, password: string, city: string) => {
        if (!city || !name || !email || !password) throw new InvalidArgumentsError('All fields (city, name, email and password) are required not empty.');
        if (await userRepository.findByEmail(email)) throw new InvalidCredentialsError('Email already in use.');

        const newUser = new LP_User(name, email, password, city);
        newUser.hashPassword();

        return await userRepository.saveUser(newUser);
    }

    public getUserById = async (id: number) => {
        return await this.userRepository.findById(id);
    }

    public getUserPublicDataById = async (id: number) => {
        const user = await this.getUserById(id);
        return user.asPublic();
    }

    public getUserByEmail = async (email: string) => {
        return await this.userRepository.findByEmail(email);
    }

    private saveUser = async (user: LP_User) => {
        return await this.userRepository.saveUser(user);
    }

    public getKnownLanguagesFromUser = async (userId: number) => {
        const user = await this.getUserById(userId);
        return user.getKnownLanguages();
    }

    public getWantToKnowLanguagesFromUser = async (userId: number) => {
        const user = await this.getUserById(userId);
        return user.getWantToKnowLanguages();
    }

    addKnownLanguagesToUser = async (userId: number, languages: Language[]) => {
        const user = await this.getUserById(userId);

        for (const language of languages) {
            user.addKnownLanguage(language);
        }

        return await this.saveUser(user);
    }

    addWantToKnowLanguagesToUser = async (userId: number, languages: Language[]) => {
        const user = await this.getUserById(userId);

        for (const language of languages) {
            user.addWantToKnowLanguage(language);
        }

        return await this.saveUser(user);
    }

    removeKnownLanguagesFromUser = async (userId: number, languages: Language[]) => {
        const user = await this.getUserById(userId);

        for (const language of languages) {
            user.removeKnownLanguage(language);
        }

        return await this.saveUser(user);
    }

    removeWantToKnowLanguagesFromUser = async (userId: number, languages: Language[]) => {
        const user = await this.getUserById(userId);

        for (const language of languages) {
            user.removeWantToKnowLanguage(language);
        }

        return await this.saveUser(user);
    }
}

export const userService = new UserService();