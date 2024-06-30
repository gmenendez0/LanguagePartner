import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import {Request, Response, NextFunction} from "express";
import {userService} from "../service/UserService";
import {JWT_SECRET} from "./constants";

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};
const jwtVerify = async (payload: any, done: any) => {
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

export const passportAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    await passport.authenticate("jwt", {session: false})(req, res, next);
}

export default passport;