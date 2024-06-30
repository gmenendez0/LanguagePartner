import { Language } from '../entity/Language/Language';
import '../app'
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {LanguageRepository, languageRepository} from "../repository/LanguageRepository";

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

    //Adds all received languages to the database. Should only be used once, when the database is created.
    public addLanguagesToDatabase = async (languagesNames: string[]) => {
        this.validateLanguageNames(languagesNames);

        const persistedLanguages = await this.getAllLanguages();
        const persistedLanguagesNames = persistedLanguages.map((language: Language) => language.getName());

        for (const languageName of languagesNames) {
            if (!persistedLanguagesNames.includes(languageName)) {
                await this.createLanguage(languageName);
            }
        }
    }

    /**
     * Retrieves languages from the repository by their names.
     * @param names - The names of the languages to retrieve.
     * @returns A promise that resolves with the languages found in the repository, or an empty array if not found.
     */
    public getLanguagesByName = async (names: string[]) => {
        this.validateLanguageNames(names);
        return await this.languageRepository.getLanguagesByName(names);
    }

    private validateLanguageNames = (languageNames: string[]) => {
        if (!languageNames || languageNames.length === 0) throw new InvalidArgumentsError('No languages provided.');
    }

    /**
     * Retrieves all languages from the repository.
     * @returns A promise that resolves with all languages in the repository.
     */
    private getAllLanguages = async () => {
        return this.languageRepository.getAllLanguagesNames();
    }
}

export const languageService = new LanguageService();