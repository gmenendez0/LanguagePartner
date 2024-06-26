import {LP_User} from "../entity/User/LP_User";
import {AppDataSource} from "../data-source";
import {RepositoryAccessError} from "../../errors/RepositoryAccessError";
import {PersistanceError} from "../../errors/PersistanceError";
import {Repository} from "typeorm";

export type UserRepository = Repository<LP_User> & { findByEmail(email: string): Promise<LP_User>; saveUser(user: LP_User): Promise<LP_User>; findById(id: number): Promise<LP_User>; };

export const userRepository = AppDataSource.getRepository(LP_User).extend({

    /**
     * Finds a user by their email.
     * @param email - The email of the user to find.
     * @returns A promise that resolves with the user found, or undefined if not found.
     * @throws {RepositoryAccessError} If an error occurs while accessing the repository.
     */
    findByEmail(email: string) {
        try {
            return this.findOne({
                where: {
                    email: email,
                },
                relations: ["approvedUsers", "rejectedUsers", "matchedUsers", "knownLanguages", "wantToKnowLanguages"],
            });
        } catch (error) {
            throw new RepositoryAccessError();
        }
    },

    /**
     * Saves a user in the repository.
     * @param user - The user object to save.
     * @returns A promise that resolves with the saved user.
     * @throws {PersistanceError} If an error occurs while persisting the user.
     */
    saveUser(user: LP_User) {
        try {
            return this.save(user);
        } catch (error) {
            throw new PersistanceError();
        }
    },

    /**
     * Finds a user by their ID.
     * @param id - The ID of the user to find.
     * @returns A promise that resolves with the user found, or undefined if not found.
     * @throws {RepositoryAccessError} If an error occurs while accessing the repository.
     */
    findById(id: number) {
        try {
            return this.findOne({
                where: {
                    id: id,
                },
                relations: ["approvedUsers", "rejectedUsers", "matchedUsers", "knownLanguages", "wantToKnowLanguages"],
            });
        } catch (error) {
            throw new RepositoryAccessError();
        }
    },

    /** 
     * Finds all users with their relationships.
     * @returns A promise that resolves with all users found.
     * @throws {RepositoryAccessError} If an error occurs while accessing the repository.
    */
    getAllUsers() {
        try {
            return this.find({
                relations: ["approvedUsers", "rejectedUsers", "matchedUsers", "knownLanguages", "wantToKnowLanguages"],
            });
        } catch (error) {
            throw new RepositoryAccessError();
        }
    }
})
