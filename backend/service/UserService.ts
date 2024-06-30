import {UserRepository} from "../repository/UserRepository";
import {userRepository} from "../repository/UserRepository";
import {Language} from "../entity/Language/Language";
import {LP_User} from "../entity/LP_User/LP_User";
import {ResourceNotFoundError} from "../errors/ResourceNotFoundError";
import {CreateLP_UserDTO} from "../DTOs/UserDTOs/CreateLP_UserDTO";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {UpdateLP_UserPublicDataDTO} from "../DTOs/UserDTOs/UpdateLP_UserDTO";
import {languageService} from "./LanguageService";
import {ConfigureLP_UserDTO} from "../DTOs/UserDTOs/ConfigureLP_UserDTO";
import {InvalidResourceStateError} from "../errors/InvalidResourceStateError";
import {ImgurService} from "./ImgurService";
import {HttpInterface} from "../externalAPI/HttpInterface";

export class UserService {
    private userRepository: UserRepository;
    private imgurService: ImgurService;

    constructor() {
        this.userRepository = userRepository;
        this.imgurService = new ImgurService(new HttpInterface());
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
        const user = await this.getUserOrError(id);
        return user.asPublicDTO();
    }

    public userIsConfigured = async (userId: number) => {
        const user = await this.getUserOrError(userId);
        return user.isConfigured();
    }

    public configureUser = async (userId: number, userConfig: ConfigureLP_UserDTO) => {
        const user = await this.getUserOrError(userId);
        if (user.isConfigured()) throw new InvalidResourceStateError('User is already configured.');
        await userConfig.validate();

        const wantToKnowLanguages = await this.getLanguagesByName(userConfig.wantToKnowLanguages);
        const knownLanguages = await this.getLanguagesByName(userConfig.knownLanguages);

        user.configure(knownLanguages, wantToKnowLanguages);
        return this.saveUser(user);
    }

    public updateUserProfilePic = async (userId: number, pic: Express.Multer.File) => {
        const user = await this.getUserOrError(userId);
        const picHash = await this.imgurService.uploadPhoto(pic);

        const oldPicHash = user.getProfilePicHash();
        user.setProfilePicHash(picHash);

        if(oldPicHash && oldPicHash != "vADlmQs") await this.imgurService.deletePhoto(oldPicHash);
        return this.saveUser(user);
    }

    public updateUserPublicData = async (userId: number, userData: UpdateLP_UserPublicDataDTO) => {
        await userData.validate();
        const user = await this.getUserOrError(userId);

        await this.updateBasicLPUserData(user, userData);
        await this.updateLPUserLanguages(user, userData);

        return this.saveUser(user);
    }

    private updateBasicLPUserData = async (user: LP_User, userData: UpdateLP_UserPublicDataDTO) => {
        if (userData.name) user.setName(userData.name);
        if (userData.city) user.setCity(userData.city);
    }

    private updateLPUserLanguages = async (user: LP_User, userData: UpdateLP_UserPublicDataDTO) => {
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

    private getUserOrError = async (userId: number) => {
        const user = await this.getUserById(userId);
        if (!user) throw new ResourceNotFoundError();

        return user;
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