import express from 'express';
import { Request, Response } from 'express';
import session from 'express-session';
import UserModel from './model/user';
import myRouter from './routes/routes';
import "reflect-metadata";
import { AppDataSource } from "./src/data-source"
import { User } from "./src/entity/User"	
import { Language } from "./src/entity/Language"
import swaggerUi from 'swagger-ui-express';
import { UserRepository } from './src/repository/UserRepository';
// import * as swaggerDocument from './swagger_output.json';

const userRepository = AppDataSource.getRepository(User) as UserRepository;
const languageRepository = AppDataSource.getRepository(Language);

const sessionOptions: session.SessionOptions = {
  secret: 'yourSecretKey', // replace with a strong secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
};

declare module 'express-session' {
  interface SessionData {
    user: number | null;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: session.Session & Partial<session.SessionData>;
    }
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(session(sessionOptions));
app.use('/', myRouter);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

AppDataSource.initialize().then(async () => {

  // Run all pending migrations
  await AppDataSource.runMigrations({
    transaction: 'all',
  });


  console.log("Here you can setup and run express / fastify / any other framework.")

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => console.log(error))


