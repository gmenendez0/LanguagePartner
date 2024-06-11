import {UserRepository} from "../src/repository/UserRepository";
import {userRepository} from "../src/repository/UserRepository";
import {Language} from "../src/entity/Language";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {User} from "../src/entity/User";

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

        await userRepository.saveUser(newUser);
    }

    addKnownLanguageToUser = async (userId: number, language: Language) => {
        //Deberia agregar un lenguaje al usuario
    }

    addLearningLanguageToUser = async (userId: number, language: Language) => {
        //Deberia agregar un lenguaje al usuario
    }

    removeKnownLanguageFromUser = async (userId: number, language: Language) => {
        //Deberia remover un lenguaje al usuario
    }

    removeLearningLanguageFromUser = async (userId: number, language: Language) => {
        //Deberia remover un lenguaje al usuario
    }

    getKnownLanguagesFromUser = async (userId: number) => {
        //Deberia devolver los lenguajes conocidos del usuario
    }

    getLearningLanguagesFromUser = async (userId: number) => {
        //Deberia devolver los lenguajes que esta aprendiendo el usuario
    }

    getLikedUsersFromUser = async (userId: number) => {
        //Deberia devolver los usuarios que le gustan al usuario
    }

    getDislikedUsersFromUser = async (userId: number) => {
        //Deberia devolver los usuarios que no le gustan al usuario
    }
}

export const userService = new UserService();