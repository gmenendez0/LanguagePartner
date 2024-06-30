import {AppDataSource} from "../db/data-source";
import {RepositoryAccessError} from "../errors/RepositoryAccessError";
import {PersistanceError} from "../errors/PersistanceError";
import {Language} from "../entity/Language/Language";
import {In, Repository} from "typeorm";

export type LanguageRepository = Repository<Language> & { findByName(name: string): Promise<Language>; saveLanguage(language: Language): Promise<Language>; getLanguagesByName(names: string[]): Promise<Language[]>; getAllLanguagesNames(): Language[];}

export const languageRepository = AppDataSource.getRepository(Language).extend({
    /**
     * Finds a language by its name.
     * @param name - The name of the language to find.
     * @returns A promise that resolves with the language found, or undefined if not found.
     * @throws {RepositoryAccessError} If an error occurs while accessing the repository.
     */
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

    /**
     * Saves a language in the repository.
     * @param language - The language object to save.
     * @returns A promise that resolves with the saved language.
     * @throws {PersistanceError} If an error occurs while persisting the language.
     */
    saveLanguage(language: Language): Promise<Language> {
        try {
            return this.save(language);
        } catch (error) {
            throw new PersistanceError();
        }
    },

    /**
     * Finds languages by their names.
     * @param names - The names of the languages to find.
     * @returns A promise that resolves with the languages found, or an empty array if not found.
     * @throws {RepositoryAccessError} If an error occurs while accessing the repository.
     */
    getLanguagesByName (names: string[]): Promise<Language[]> {
        try {
            return this.find({
                where: {
                    name: In(names),
                }
            });
        } catch (error) {
            throw new RepositoryAccessError();
        }
    },
    /**
     * @function getAllLanguagesNames
     * @description Retrieves all language names from the repository.
     *
     * @returns {Language[]} An array of Language objects containing only the name of each language.
     *
     * @throws {RepositoryAccessError} Throws an error if there is an issue accessing the repository.
     */
    getAllLanguagesNames(): Language[] {
        try {
            return this.find({
                select: ["name"]
            })
        } catch (error) {
            throw new RepositoryAccessError();
        }
    }
})