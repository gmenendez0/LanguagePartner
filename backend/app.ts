import express from 'express';
import myRouter from './routes/routes';
import "reflect-metadata";
import { AppDataSource } from "./src/data-source"
import passport from './config/passportConfig';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger_output.json';
import cors from 'cors';
import langs from 'langs';
import {LanguageService} from "./service/LanguageService";
import {container} from "./config/InversifyJSTypes";
import {HttpInterface} from "./externalAPI/HttpInterface";
import {ImgurService} from "./service/ImgurService";
import {SessionService} from "./service/SessionService";
import {UserService} from "./service/UserService";
import {UserRepository} from "./src/repository/UserRepository";
import {LanguageRepository} from "./src/repository/LanguageRepository";
import {TokenSessionStrategy} from "./service/sessionStrategy/TokenSessionStrategy";
import 'reflect-metadata';

const app = express();

// TODO move this client url somewhere else
const whitelist = ['http://localhost:8081', 'http://localhost', 'http://localhost:3000', 'http://localhost:3001'];
const corsOptions = {
  origin: function (origin, callback) {
    //console.log('Origin:', origin); // Log the origin of each request
    if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// Enable CORS for whitelisted origins
app.use(cors(corsOptions));
app.use(express.json());
app.use('/', myRouter);
app.use(passport.initialize());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const imgurService = container.get<ImgurService>('ImgurService');
const languageService = container.get<LanguageService>('LanguageService');
const sessionService = container.get<SessionService>('SessionService');
const userService = container.get<UserService>('UserService');
const userRepository = container.get<UserRepository>('UserRepository');
const languageRepository = container.get<LanguageRepository>('LanguageRepository');
const tokenSessionStrategy = container.get<TokenSessionStrategy>('TokenSessionStrategy');
const httpInterface = container.get<HttpInterface>('HttpInterface');

const addLanguagesToDatabase = async () => {
    const languages = langs.all().map((lang: { name: string; }) => lang.name);
    await languageService.addLanguagesToDatabase(languages);
}

const PORT = process.env.PORT || 3000;
AppDataSource.initialize().then(async () => {
  // Run all pending migrations
  await AppDataSource.runMigrations({transaction: 'all'});
  await addLanguagesToDatabase();

  app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});
}).catch(error => console.log(error))


