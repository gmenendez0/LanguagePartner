import {UserRepository} from "../src/repository/UserRepository";
import {userRepository} from "../src/repository/UserRepository";
import {Language} from "../src/entity/Language/Language";
import {LP_User} from "../src/entity/User/LP_User";
import {ResourceNotFoundError} from "../errors/ResourceNotFoundError";
import {CreateLP_UserDTO} from "../DTOs/UserDTOs/CreateLP_UserDTO";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {UpdateLPUserPublicDataDTO} from "../DTOs/UserDTOs/UpdateLPUserDTO";
import {languageService} from "./LanguageService";

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

    public getUserByEmail = async (email: string) => {
        return await this.userRepository.findByEmail(email);
    }

    public getUserPublicDataById = async (id: number) => {
        const user = await this.getUserById(id);
        if(!user) throw new ResourceNotFoundError();
        //return user.asPublicDTO();
        return user
    }

    public updateUserPublicData = async (userId: number, userData: UpdateLPUserPublicDataDTO) => {
        await userData.validate();
        const user = await this.getUserById(userId);

        await this.updateBasicLPUserData(user, userData);
        await this.updateLPUserLanguages(user, userData);

        return this.saveUser(user);
    }

    private updateBasicLPUserData = async (user: LP_User, userData: UpdateLPUserPublicDataDTO) => {
        if (userData.name) user.setName(userData.name);
        if (userData.city) user.setCity(userData.city);
        if (userData.profilePicHash) user.setProfilePicHash(userData.profilePicHash);
    }

    private updateLPUserLanguages = async (user: LP_User, userData: UpdateLPUserPublicDataDTO) => {
        await this.setLanguagesOnLPUserOperation(userData.knownLanguages, user.setKnownLanguages);
        await this.setLanguagesOnLPUserOperation(userData.wantToKnowLanguages, user.setWantToKnowLanguages);
        await this.executeUpdateLanguageCollectionOperationOnLPUser(userData.knownLanguagesToRemove, user.removeKnownLanguage);
        await this.executeUpdateLanguageCollectionOperationOnLPUser(userData.wantToKnowLanguagesToRemove, user.removeWantToKnowLanguage);
        await this.executeUpdateLanguageCollectionOperationOnLPUser(userData.knownLanguagesToAdd, user.addKnownLanguage);
        await this.executeUpdateLanguageCollectionOperationOnLPUser(userData.wantToKnowLanguagesToAdd, user.addWantToKnowLanguage);
    }

    private executeUpdateLanguageCollectionOperationOnLPUser = async (languageNames: string[], operation: (language: Language) => void) => {
        if (languageNames) {
            const languages = await this.getLanguagesByName(languageNames);

            for (const language of languages) {
                operation(language);
            }
        }
    }

    private setLanguagesOnLPUserOperation = async (languagesNames: string[], operation: (language: Language[]) => void) => {
        if(languagesNames) {
            const languages = await this.getLanguagesByName(languagesNames);
            operation(languages);
        }
    }

    private saveUser = async (user: LP_User) => {
        return await this.userRepository.saveUser(user);
    }

    private getLanguagesByName = async (languagesNames: string[]) => {
        const languages = await languageService.getLanguagesByName(languagesNames);

        for (let languageName of languagesNames) {
            if (!languages.some(language => language.getName() === languageName)) throw new InvalidArgumentsError(`Language with name ${languageName} is invalid.`);
        }

        return languages;
    }
}

export const userService = new UserService();