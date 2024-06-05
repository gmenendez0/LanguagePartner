import bcrypt from "bcrypt";
import {User} from "../entity/User";
import * as jwt from "jsonwebtoken";

export const hashString = (string: string) => {
    return bcrypt.hashSync(string, 10);
}

export const compareHashedString = (string: string, hashedString: string) => {
    return bcrypt.compareSync(string, hashedString);
}

export const generateJWTForUser = (user: User) => {
    return jwt.sign({id: user.getId}, "secretKey", {expiresIn: "1h"}); //TODO Reemplazar secretKey por una variable de entorno, expiresIn debe ser CONST.
}