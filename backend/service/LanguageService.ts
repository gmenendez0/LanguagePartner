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
     * Retrieves languages from the repository by their names.
     * @param names - The names of the languages to retrieve.
     * @returns A promise that resolves with the languages found in the repository, or an empty array if not found.
     */
    public getLanguagesByName = async (names: string[]) => {
        return await this.languageRepository.getLanguagesByName(names);
    }
}

export const languageService = new LanguageService();