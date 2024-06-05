import {User} from "../entity/User";
import {AppDataSource} from "../data-source";
import {RepositoryAccessError} from "../../errors/RepositoryAccessError";
import {PersistanceError} from "../../errors/PersistanceError";

export const userRepository = AppDataSource.getRepository(User).extend({
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
    saveUser(user: User) {
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
