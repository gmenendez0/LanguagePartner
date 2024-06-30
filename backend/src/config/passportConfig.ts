import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import {Request, Response, NextFunction} from "express";
import {userService} from "../service/UserService";
import {JWT_SECRET, PASSPORT_AUTH_STRATEGY} from "./constants";

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

/**
 * @function jwtVerify
 * @description Verifies the JWT token's payload and retrieves the user associated with it.
 *
 * @param {any} payload - The payload of the JWT token.
 * @param {Function} done - The callback function to return the authenticated user or an error.
 *
 * @returns {Promise<void>}
 */
const jwtVerify = async (payload: any, done: any): Promise<void> => {
    try {
        const user = await userService.getUserById(payload.userId);

        if (!user) return done(null, false);
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}

const tokenStrategy = new JwtStrategy(options, jwtVerify);
passport.use(tokenStrategy);

/**
 * @function passportAuthenticate
 * @description Middleware function to authenticate requests using Passport with JWT strategy.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 *
 * @returns {Promise<void>}
 */
export const passportAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await passport.authenticate(PASSPORT_AUTH_STRATEGY, {session: false})(req, res, next);
}

export default passport;