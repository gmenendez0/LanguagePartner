import {AppDataSource} from "../data-source";
import {RepositoryAccessError} from "../../errors/RepositoryAccessError";
import {PersistanceError} from "../../errors/PersistanceError";
import {Language} from "../entity/Language/Language";
import {Repository} from "typeorm";

export type LanguageRepository = Repository<Language> & { findByName(name: string): Promise<Language>; saveLanguage(language: Language): Promise<Language>; };

export const languageRepository = AppDataSource.getRepository(Language).extend({
    findByName(name: string): Promise<Language> {
        try {
            return this.findOne({
                where: {
                    name: name
                }
            });
        } catch (error) {
            throw new RepositoryAccessError();
        }
    },
    saveLanguage(language: Language): Promise<Language> {
        try {
            return this.save(language);
        } catch (error) {
            throw new PersistanceError();
        }
    },
})