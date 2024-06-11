import {LP_User} from "../entity/User/LP_User";
import {AppDataSource} from "../data-source";
import {RepositoryAccessError} from "../../errors/RepositoryAccessError";
import {PersistanceError} from "../../errors/PersistanceError";
import {Repository} from "typeorm";

export type UserRepository = Repository<LP_User> & { findByEmail(email: string): Promise<LP_User>; saveUser(user: LP_User): Promise<LP_User>; findById(id: number): Promise<LP_User>; };

export const userRepository = AppDataSource.getRepository(LP_User).extend({
    findByEmail(email: string) {
        try {
            return this.findOne({
                where: {
                    email: email,
                }
            });
        } catch (error) {
            throw new RepositoryAccessError();
        }
    },
    saveUser(user: LP_User) {
        try {
            return this.save(user);
        } catch (error) {
            throw new PersistanceError();
        }
    },
    findById(id: number) {
        try {
            return this.findOne({
                where: {
                    id: id,
                }
            });
        } catch (error) {
            throw new RepositoryAccessError();
        }
    }
})
