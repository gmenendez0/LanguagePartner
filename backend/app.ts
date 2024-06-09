import express from 'express';
import myRouter from './routes/routes';
import "reflect-metadata";
import { AppDataSource } from "./src/data-source"
import passport from './config/passportConfig';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger_output.json';

const app = express();
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


