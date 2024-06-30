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
import {DEFAULT_USER_PIC_HASH} from "../config/constants";

export class UserService {
    private userRepository: UserRepository;
    private imgurService: ImgurService;

    constructor() {
        this.userRepository = userRepository;
        this.imgurService = new ImgurService(new HttpInterface());
    }

    /**
     * @function createUser
     * @description Creates a new user with the provided data.
     *
     * @param {CreateLP_UserDTO} userData - The data to create the user with.
     *
     * @throws {InvalidArgumentsError} If the email is already in use.
     * @returns {Promise<void>}
     */
    public createUser = async (userData: CreateLP_UserDTO): Promise<LP_User> => {
        const newUser = await userData.toBusinessObject();

        if (await userRepository.findByEmail(newUser.getEmail())) throw new InvalidArgumentsError('Email already in use.');

        return await userRepository.saveUser(newUser);
    }

    /**
     * @function getUserById
     * @description Retrieves a user by their ID.
     *
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Promise<LP_User | undefined>} A promise that resolves with the user object, or undefined if not found.
     */
    public getUserById = async (id: number): Promise<LP_User | undefined> => {
        return await this.userRepository.findById(id);
    }

    /**
     * @function getUserByEmail
     * @description Retrieves a user by their email address.
     *
     * @param {string} email - The email address of the user to retrieve.
     * @returns {Promise<LP_User | undefined>} A promise that resolves with the user object, or undefined if not found.
     */
    public getUserByEmail = async (email: string): Promise<LP_User | undefined> => {
        return await this.userRepository.findByEmail(email);
    }

    /**
     * @function getUserPublicDataById
     * @description Retrieves public data of a user by their ID.
     *
     * @param {number} id - The ID of the user to retrieve public data for.
     * @returns {Promise<any>} A promise that resolves with the user's public data.
     */
    public getUserPublicDataById = async (id: number): Promise<any> => {
        const user = await this.getUserOrError(id);
        return user.asPublicDTO();
    }

    /**
     * @function userIsConfigured
     * @description Checks if a user is configured.
     *
     * @param {number} userId - The ID of the user to check.
     * @returns {Promise<boolean>} A promise that resolves with true if the user is configured, false otherwise.
     */
    public userIsConfigured = async (userId: number): Promise<boolean> => {
        const user = await this.getUserOrError(userId);
        return user.isConfigured();
    }


    /**
     * @function configureUser
     * @description Configures a user with the provided data.
     *
     * @param {number} userId - The ID of the user to configure.
     * @param {ConfigureLP_UserDTO} userConfig - The data to configure the user with.
     *
     * @throws {InvalidResourceStateError} If the user is already configured.
     * @returns {Promise<void>}
     */
    public configureUser = async (userId: number, userConfig: ConfigureLP_UserDTO): Promise<LP_User> => {
        const user = await this.getUserOrError(userId);
        if (user.isConfigured()) throw new InvalidResourceStateError('User is already configured.');
        await userConfig.validate();

        const wantToKnowLanguages = await this.getLanguagesByName(userConfig.wantToKnowLanguages);
        const knownLanguages = await this.getLanguagesByName(userConfig.knownLanguages);

        user.configure(knownLanguages, wantToKnowLanguages);
        return this.saveUser(user);
    }

    /**
     * @function updateUserProfilePic
     * @description Updates a user's profile picture.
     *
     * @param {number} userId - The ID of the user to update.
     * @param {Express.Multer.File} pic - The new profile picture file.
     *
     * @returns {Promise<LP_User>} A promise that resolves with the updated user object.
     */
    public updateUserProfilePic = async (userId: number, pic: Express.Multer.File): Promise<LP_User> => {
        const user = await this.getUserOrError(userId);
        const picHash = await this.imgurService.uploadPhoto(pic);

        const oldPicHash = user.getProfilePicHash();
        user.setProfilePicHash(picHash);

        if(oldPicHash && oldPicHash != DEFAULT_USER_PIC_HASH) await this.imgurService.deletePhoto(oldPicHash);
        return this.saveUser(user);
    }

    /**
     * @function updateUserPublicData
     * @description Updates a user's public data with the provided data.
     *
     * @param {number} userId - The ID of the user to update.
     * @param {UpdateLP_UserPublicDataDTO} userData - The updated public data for the user.
     *
     * @returns {Promise<LP_User>} A promise that resolves with the updated user object.
     */

    public updateUserPublicData = async (userId: number, userData: UpdateLP_UserPublicDataDTO): Promise<LP_User> => {
        await userData.validate();
        const user = await this.getUserOrError(userId);

        await this.updateBasicLPUserData(user, userData);
        await this.updateLPUserLanguages(user, userData);

        return this.saveUser(user);
    }

    /**
     * @function updateBasicLPUserData
     * @description Updates the basic data of a user (name, city) with the provided data.
     *
     * @param {LP_User} user - The user object to update.
     * @param {UpdateLP_UserPublicDataDTO} userData - The updated public data for the user.
     *
     * @returns {Promise<void>}
     */
    private updateBasicLPUserData = async (user: LP_User, userData: UpdateLP_UserPublicDataDTO): Promise<void> => {
        if (userData.name) user.setName(userData.name);
        if (userData.city) user.setCity(userData.city);
    }

    /**
     * @function updateLPUserLanguages
     * @description Updates the languages of a user with the provided data.
     *
     * @param {LP_User} user - The user object to update.
     * @param {UpdateLP_UserPublicDataDTO} userData - The updated public data for the user.
     *
     * @returns {Promise<void>}
     */
    private updateLPUserLanguages = async (user: LP_User, userData: UpdateLP_UserPublicDataDTO): Promise<void> => {
        await this.setLanguagesOnLPUserOperation(userData.knownLanguages, user.setKnownLanguages);
        await this.setLanguagesOnLPUserOperation(userData.wantToKnowLanguages, user.setWantToKnowLanguages);
        await this.executeUpdateLanguageCollectionOperationOnLPUser(userData.knownLanguagesToRemove, user.removeKnownLanguage);
        await this.executeUpdateLanguageCollectionOperationOnLPUser(userData.wantToKnowLanguagesToRemove, user.removeWantToKnowLanguage);
        await this.executeUpdateLanguageCollectionOperationOnLPUser(userData.knownLanguagesToAdd, user.addKnownLanguage);
        await this.executeUpdateLanguageCollectionOperationOnLPUser(userData.wantToKnowLanguagesToAdd, user.addWantToKnowLanguage);
    }

    /**
     * @function executeUpdateLanguageCollectionOperationOnLPUser
     * @description Executes an update operation on a user's language collection based on the provided language names.
     *
     * @param {string[]} languageNames - An array of language names to operate on.
     * @param {(language: Language) => void} operation - The operation function to execute on each language.
     *
     * @returns {Promise<void>}
     */
    private executeUpdateLanguageCollectionOperationOnLPUser = async (languageNames: string[], operation: (language: Language) => void): Promise<void> => {
        if (languageNames) {
            const languages = await this.getLanguagesByName(languageNames);

            for (const language of languages) {
                operation(language);
            }
        }
    }

    /**
     * @function setLanguagesOnLPUserOperation
     * @description Sets languages on a user object using the provided operation function.
     *
     * @param {string[]} languagesNames - An array of language names to set.
     * @param {(languages: Language[]) => void} operation - The operation function to execute with the languages array.
     *
     * @returns {Promise<void>}
     */
    private setLanguagesOnLPUserOperation = async (languagesNames: string[], operation: (language: Language[]) => void): Promise<void> => {
        if(languagesNames) {
            const languages = await this.getLanguagesByName(languagesNames);
            operation(languages);
        }
    }

    /**
     * @function saveUser
     * @description Saves a user object into the repository.
     *
     * @param {LP_User} user - The user object to save.
     * @returns {Promise<void>}
     * @private
     */
    private saveUser = async (user: LP_User): Promise<LP_User> => {
        return await this.userRepository.saveUser(user);
    }

    /**
     * @function getUserOrError
     * @description Retrieves a user by their ID or throws a ResourceNotFoundError if not found.
     *
     * @param {number} userId - The ID of the user to retrieve.
     * @returns {Promise<LP_User>} A promise that resolves with the user object if found.
     * @throws {ResourceNotFoundError} If no user with the given ID is found.
     * @private
     */
    private getUserOrError = async (userId: number): Promise<LP_User> => {
        const user = await this.getUserById(userId);
        if (!user) throw new ResourceNotFoundError();

        return user;
    }

    /**
     * @function getLanguagesByName
     * @description Retrieves languages by their names.
     *
     * @param {string[]} languagesNames - An array of language names to retrieve.
     * @returns {Promise<Language[]>} A promise that resolves with an array of Language objects.
     * @throws {InvalidArgumentsError} If any of the provided language names are invalid.
     * @private
     */
    private getLanguagesByName = async (languagesNames: string[]): Promise<Language[]> => {
        const languages = await languageService.getLanguagesByName(languagesNames);

        for (let languageName of languagesNames) {
            if (!languages.some(language => language.getName() === languageName)) throw new InvalidArgumentsError(`Language with name ${languageName} is invalid.`);
        }

        return languages;
    }
}

export const userService = new UserService();