import express from 'express';
import myRouter from './routes/routes';
import "reflect-metadata";
import { AppDataSource } from "./src/data-source"
import passport from './config/passportConfig';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger_output.json';
import cors from 'cors';

/*
    TODO:
    1. Todos los secretos hardcodeados, deben ser almacenados en variables de entorno.
    2. Reordenar directorios.
    3. Quitar el script de create_database.sh, ya que no debe estar tan acoplado al backend.
    4. Poder actualizar el perfil de un usuario (City) y foto (opcional).
    5. Documentar todas las funciones.
    6. Desarrollar MatchingControllers.
    7. Desarrollar ChatControllers.
    8. En LP_User, en asPublic, agregar los usuarios likeados, dislikeados y matcheados.
    9. Revisar lo de CORS.
 */


const app = express();

// TODO move this client url somewhere else
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


const PORT = process.env.PORT || 3000;
AppDataSource.initialize().then(async () => {
  // Run all pending migrations
  await AppDataSource.runMigrations({transaction: 'all'});

  app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});
}).catch(error => console.log(error))


