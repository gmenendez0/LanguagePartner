import { Language } from '../src/entity/Language';
import '../app'
import {Repository} from "typeorm";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {languageRepository} from "../src/repository/LanguageRepository";

export class LanguageService {
    private languageRepository: Repository<Language> & { findByName(name: string): any; saveLanguage(language: Language): any; };

    constructor() {
        this.languageRepository = languageRepository;
    }

    //Pre: languageName must not be empty.
    //Post: Creates a new Language with given name and saves it in repository.
    public async createLanguage(languageName: string) {
        if (!languageName) throw new InvalidArgumentsError('Language name cannot be empty.');
        if (this.languageRepository.findByName(languageName)) throw new InvalidArgumentsError('Language already exists.');

        const newLanguage = new Language(languageName);
        this.languageRepository.saveLanguage(newLanguage);
    }
}