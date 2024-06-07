import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import {userRepository} from "../src/repository/UserRepository";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {AuthenticationError} from "../errors/AuthenticationError";
import {Request, Response, NextFunction} from "express";

const jwtVerify = async (jwt_payload: any, done: any) => {
    try {
        const user = await userRepository.findById(jwt_payload.id);
        if (user) done(null, user);
        throw new InvalidCredentialsError("Invalid token.");
    } catch (error) {
        done(error, false);
    }
}

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret_key' //TODO Debe reemplezarse
};

//Pre: Receives the payload and the done function. The payload is the decoded JWT token.
//     The done function is a passport callback that we need to call to finish the authentication process.
//Post: Returns the user corresponding to the payload (if it exists in the database), otherwise returns false as error.
const tokenStrategy = new JwtStrategy(options, jwtVerify);

passport.use(tokenStrategy);

export const passportAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        passport.authenticate(tokenStrategy, { session: false })(req, res, next);
    } catch (error) {
        throw new AuthenticationError();
    }
}

export default passport;