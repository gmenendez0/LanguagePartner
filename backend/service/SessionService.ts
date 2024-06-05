import {Repository} from "typeorm";
import {User} from "../src/entity/User";
import {AppDataSource} from "../src/data-source";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import bcrypt from 'bcrypt';
import {PersistanceError} from "../errors/PersistanceError";

export class SessionService {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    public register = async (name: string, email: string, password: string, city: string) => {
        if (!city || !name || !email || !password) throw new InvalidArgumentsError('All fields (city, name, email and password) are required not empty.');

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User(name, email, hashedPassword, city);

        try {
            await this.repository.save(newUser);
        } catch (error) {
            throw PersistanceError;
        }
    }

    public login = (req, res) => {
        // code here
    }

    public logout = (req, res) => {
        // code here
    }

    public me = (req, res) => {
        // code here
    }
}