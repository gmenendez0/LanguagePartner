import {UserRepository} from "../src/repository/UserRepository";
import {userRepository} from "../src/repository/UserRepository";
import {Language} from "../src/entity/Language/Language";
import {LP_User} from "../src/entity/User/LP_User";
import {ResourceNotFoundError} from "../errors/ResourceNotFoundError";
import {CreateLP_UserDTO} from "../DTOs/UserDTOs/CreateLP_UserDTO";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = userRepository;
    }

    public createUser = async (userData: CreateLP_UserDTO) => {
        const newUser = await userData.toBusinessObject();

        if (await userRepository.findByEmail(newUser.getEmail())) throw new InvalidArgumentsError('Email already in use.');

        return await userRepository.saveUser(newUser);
    }

    public getUserById = async (id: number) => {
        return await this.userRepository.findById(id);
    }

    public getUserPublicDataById = async (id: number) => {
        const user = await this.getUserById(id);
        if(!user) throw new ResourceNotFoundError();
        return user.asPublic();
    }

    public getUserByEmail = async (email: string) => {
        return await this.userRepository.findByEmail(email);
    }

    private saveUser = async (user: LP_User) => {
        return await this.userRepository.saveUser(user);
    }

    public addKnownLanguagesToUser = async (userId: number, languages: Language[]) => {
        const user = await this.getUserById(userId);

        for (const language of languages) {
            user.addKnownLanguage(language);
        }

        return await this.saveUser(user);
    }

    public addWantToKnowLanguagesToUser = async (userId: number, languages: Language[]) => {
        const user = await this.getUserById(userId);

        for (const language of languages) {
            user.addWantToKnowLanguage(language);
        }

        return await this.saveUser(user);
    }

    public removeKnownLanguagesFromUser = async (userId: number, languages: Language[]) => {
        const user = await this.getUserById(userId);

        for (const language of languages) {
            user.removeKnownLanguage(language);
        }

        return await this.saveUser(user);
    }

    public removeWantToKnowLanguagesFromUser = async (userId: number, languages: Language[]) => {
        const user = await this.getUserById(userId);

        for (const language of languages) {
            user.removeWantToKnowLanguage(language);
        }

        return await this.saveUser(user);
    }
}

export const userService = new UserService();