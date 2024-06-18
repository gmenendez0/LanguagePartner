import {LP_User} from "../entity/User/LP_User";
import {AppDataSource} from "../data-source";
import {RepositoryAccessError} from "../../errors/RepositoryAccessError";
import {PersistanceError} from "../../errors/PersistanceError";
import {Repository} from "typeorm";

export type UserRepository = Repository<LP_User> & { findByEmail(email: string): Promise<LP_User>; saveUser(user: LP_User): Promise<LP_User>; findById(id: number): Promise<LP_User>; getMatchableUsers(user: LP_User, amount: number): Promise<LP_User[]>};

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
            throw new RepositoryAccessError(error.message);
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
            throw new PersistanceError(error.message);
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
            throw new RepositoryAccessError(error.message);
        }
    },
    getMatchableUsers(user: LP_User, max: number) {
        try {
            return this.createQueryBuilder("user")
                .leftJoinAndSelect("user.knownLanguages", "knownLanguages")
                .leftJoinAndSelect("user.wantToKnowLanguages", "wantToKnowLanguages")
                .where("user.id != :id", { id: user.getId() })
                .andWhere("user.city = :city", { city: user.getCity() })
                .andWhere("user.id NOT IN (:...approvedUserIds)", { approvedUserIds: user.getApprovedUsers().map((approvedUser) => approvedUser.getId()) })
                //.andWhere("user.id NOT IN (:...rejectedUserIds)", { rejectedUserIds: user.getRejectedUsers().map((rejectedUser) => rejectedUser.getId()) })
                //.andWhere("user.id NOT IN (:...matchedUserIds)", { matchedUserIds: user.getMatchedUsers().map((matchedUser) => matchedUser.getId()) })
                .limit(max)
                .getMany();
        } catch (error) {
            throw new RepositoryAccessError(error.message);
        }
    }
})
