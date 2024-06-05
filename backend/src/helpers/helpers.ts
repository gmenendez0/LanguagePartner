import bcrypt from "bcrypt";
import {User} from "../entity/User";
import * as jwt from "jsonwebtoken";

//Post: Returns the hashed string.
export const hashString = (string: string) => {
    return bcrypt.hashSync(string, 10);
}

//Post: Returns true if the string (hashed) and the hashed string match, otherwise returns false.
export const compareHashedString = (string: string, hashedString: string) => {
    return bcrypt.compareSync(string, hashedString);
}

//Post: Returns a unique JWT token for the user.
export const generateJWTForUser = (user: User) => {
    return jwt.sign({id: user.getId}, "your_jwt_secret_key", {expiresIn: "1h"}); //TODO Reemplazar secretKey por una variable de entorno, expiresIn debe ser CONST.
}