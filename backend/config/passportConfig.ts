import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret_key' //TODO Debe reemplezarse
};

const tokenStrategy = new JwtStrategy(options, (jwt_payload, done) => {

});

passport.use(tokenStrategy);

export default passport;