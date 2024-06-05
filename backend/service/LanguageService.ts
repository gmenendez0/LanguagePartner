import { Language } from '../src/entity/Language';
import '../app'
import { AppDataSource } from '../src/data-source';
import {Repository} from "typeorm";
import {PersistanceError} from "../errors/PersistanceError";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";

export class LanguageService {
    private languageRepository: Repository<Language>;

    constructor() {
        this.languageRepository = AppDataSource.getRepository(Language);
    }

    //Pre: languageName must not be empty.
    //Post: Creates a new Language with given name and saves it in repository.
    public async createLanguage(languageName: string) {
        if (!languageName) throw new InvalidArgumentsError('Language name cannot be empty.');
        const newLanguage = new Language(languageName);

        try {
            await this.languageRepository.save(newLanguage);
        } catch (error) {
            throw new PersistanceError();
        }
    }
}