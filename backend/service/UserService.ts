import {UserRepository} from "../src/repository/UserRepository";
import {userRepository} from "../src/repository/UserRepository";
import {Language} from "../src/entity/Language/Language";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {User} from "../src/entity/User/User";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = userRepository;
    }

    getUserById = async (id: number) => {
        return await this.userRepository.findById(id);
    }

    getUserByEmail = async (email: string) => {
        return await this.userRepository.findByEmail(email);
    }

    createUser = async (name: string, email: string, password: string, city: string) => {
        if (!city || !name || !email || !password) throw new InvalidArgumentsError('All fields (city, name, email and password) are required not empty.');
        if (await userRepository.findByEmail(email)) throw new InvalidCredentialsError('Email already in use.');

        const newUser = new User(name, email, password, city);
        newUser.hashPassword();

        await userRepository.saveUser(newUser);
    }

    addKnownLanguageToUser = async (userId: number, language: Language) => {
        const user = await this.getUserById(userId);
        user.addKnownLanguage(language);
    }

    addWantToKnowLanguageToUser = async (userId: number, language: Language) => {
        const user = await this.getUserById(userId);
        user.addWantToKnowLanguage(language);
    }

    removeKnownLanguageFromUser = async (userId: number, language: Language) => {
        const user = await this.getUserById(userId);
        user.removeKnownLanguage(language);
    }

    removeWantToKnowLanguageFromUser = async (userId: number, language: Language) => {
        const user = await this.getUserById(userId);
        user.removeWantToKnowLanguage(language);
    }

    getKnownLanguagesFromUser = async (userId: number) => {
        const user = await this.getUserById(userId);
        return user.getKnownLanguages();
    }

    getWantToKnowLanguagesFromUser = async (userId: number) => {
        const user = await this.getUserById(userId);
        return user.getWantToKnowLanguages();
    }
}

export const userService = new UserService();