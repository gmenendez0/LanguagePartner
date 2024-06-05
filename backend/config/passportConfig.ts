import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret_key' //TODO Debe reemplezarse
};

//Pre: Receives the payload and the done function. The payload is the decoded JWT token.
//     The done function is a passport callback that we need to call to finish the authentication process.
//Post: Returns the user corresponding to the payload (if it exists in the database), otherwise returns false as error.
const tokenStrategy = new JwtStrategy(options, (jwt_payload, done) => {

});

passport.use(tokenStrategy);

export default passport;