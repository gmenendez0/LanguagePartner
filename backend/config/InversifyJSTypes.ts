import { Container } from 'inversify';
import {ImgurService} from "../service/ImgurService";
import {LanguageService} from "../service/LanguageService";
import {SessionService} from "../service/SessionService";
import {UserService} from "../service/UserService";
import {userRepository, UserRepository} from "../src/repository/UserRepository";
import {languageRepository, LanguageRepository} from "../src/repository/LanguageRepository";
import {TokenSessionStrategy} from "../service/sessionStrategy/TokenSessionStrategy";
import {HttpInterface} from "../externalAPI/HttpInterface";

const TYPES = {
    ImgurService: Symbol("ImgurService"),
    LanguageService: Symbol("LanguageService"),
    SessionService: Symbol("SessionService"),
    UserService: Symbol("UserService"),
    LanguageRepository: Symbol("LanguageRepository"),
    UserRepository: Symbol("UserRepository"),
    TokenSessionStrategy: Symbol("TokenSessionStrategy"),
    HttpInterface: Symbol("HttpInterface")
};

const container = new Container();
container.bind<ImgurService>(TYPES.ImgurService).to(ImgurService);
container.bind<LanguageService>(TYPES.LanguageService).to(LanguageService);
container.bind<SessionService>(TYPES.SessionService).to(SessionService);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<TokenSessionStrategy>(TYPES.TokenSessionStrategy).to(TokenSessionStrategy);
container.bind<HttpInterface>(TYPES.HttpInterface).to(HttpInterface);
container.bind<LanguageRepository>(TYPES.LanguageRepository).toDynamicValue(() => {
    return languageRepository;
});
container.bind<UserRepository>(TYPES.LanguageRepository).toDynamicValue(() => {
    return userRepository;
});

export { container, TYPES };
