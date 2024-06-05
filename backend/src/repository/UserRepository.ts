import {User} from "../entity/User";
import {AppDataSource} from "../data-source";
import {RepositoryAccessError} from "../../errors/RepositoryAccessError";
import {PersistanceError} from "../../errors/PersistanceError";

export const UserRepository = AppDataSource.getRepository(User).extend({
    findByEmail(email: string) {
        try {
            return this.findOne(email);
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
})
