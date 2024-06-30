import express from 'express';
import myRouter from './routes/routes';
import "reflect-metadata";
import { AppDataSource } from "./db/data-source"
import passport from './config/passportConfig';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './config/swagger/swagger_output.json';
import langs from 'langs';
import {languageService} from "./service/LanguageService";
import corsConfigured from "./config/corsConfig";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(corsConfigured);
app.use(passport.initialize());
app.use('/', myRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const addLanguagesToDatabase = async () => {
    const languages = langs.all().map((lang: { name: string; }) => lang.name);
    await languageService.addLanguagesToDatabase(languages);
}

AppDataSource.initialize().then(async () => {
    await AppDataSource.runMigrations({transaction: 'all'});
    await addLanguagesToDatabase();

    app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});
}).catch(error => console.log(error))


