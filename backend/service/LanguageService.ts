import { Language } from '../src/entity/Language';
import '../app'
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {LanguageRepository, languageRepository} from "../src/repository/LanguageRepository";

export class LanguageService {
    private languageRepository: LanguageRepository;

    constructor() {
        this.languageRepository = languageRepository;
    }

    //Pre: languageName must not be empty.
    //Post: Creates a new Language with given name and saves it in repository.
    public createLanguage = async (languageName: string) => {
        if (!languageName) throw new InvalidArgumentsError('Language name cannot be empty.');
        if (await this.languageRepository.findByName(languageName)) throw new InvalidArgumentsError('Language already exists.');

        const newLanguage = new Language(languageName);
        await this.languageRepository.saveLanguage(newLanguage);
    }
}