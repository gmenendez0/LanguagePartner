import { Language } from '../src/entity/Language/Language';
import '../app'
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {LanguageRepository, languageRepository} from "../src/repository/LanguageRepository";

export class LanguageService {
    private languageRepository: LanguageRepository;

    constructor() {
        this.languageRepository = languageRepository;
    }

    /**
     * Creates a new language with the provided name and saves it in the repository.
     * @param languageName - The name of the language to create.
     * @throws {InvalidArgumentsError} If the language name is an empty string or if the language already exists.
     */
    public createLanguage = async (languageName: string) => {
        if (!languageName) throw new InvalidArgumentsError('Language name cannot be empty.');
        if (await this.languageRepository.findByName(languageName)) throw new InvalidArgumentsError('Language already exists.');

        const newLanguage = new Language(languageName);
        await this.languageRepository.saveLanguage(newLanguage);
    }

    /**
     * Retrieves a language from the repository by its name.
     * @param name - The name of the language to retrieve.
     * @returns A promise that resolves with the language found in the repository, or undefined if not found.
     */
    public getLanguageByName = async (name: string) => {
        return await this.languageRepository.findByName(name);
    }
}

export const languageService = new LanguageService();