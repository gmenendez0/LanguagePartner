import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import {userRepository} from "../src/repository/UserRepository";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {AuthenticationError} from "../errors/AuthenticationError";


const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret_key' //TODO Debe reemplezarse
};

//Pre: Receives the payload and the done function. The payload is the decoded JWT token.
//     The done function is a passport callback that we need to call to finish the authentication process.
//Post: Returns the user corresponding to the payload (if it exists in the database), otherwise returns false as error.
const tokenStrategy = new JwtStrategy(options, async (jwt_payload, done) => {
    try {
        const user = await userRepository.findById(jwt_payload.id);
        //TODO Atajar el error.
        user ? done(null, user) : done(new InvalidCredentialsError("Invalid token."), false);
    } catch (error) {
        return done(new AuthenticationError(), false);
    }
});

passport.use(tokenStrategy);
export default passport;