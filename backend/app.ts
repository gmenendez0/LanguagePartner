import * as express from 'express';
import { Request, Response } from 'express';
import * as session from 'express-session';
import User from './model/user';
import myRouter from './routes/routes';
import "reflect-metadata";
import { AppDataSource } from "./src/data-source"
import { Userr } from "./src/entity/User"

// ... rest of your code


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
    user: User | null;
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

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

AppDataSource.initialize().then(async () => {

  // Run all pending migrations
  await AppDataSource.runMigrations({
    transaction: 'all',
  });
  console.log("Inserting a new user into the database...")
  const user = new Userr()
  user.firstName = "Timber"
  user.lastName = "Saw"
  user.age = 25
  user.age2 = 25
  await AppDataSource.manager.save(user)
  console.log("Saved a new user with id: " + user.id)

  console.log("Loading users from the database...")
  const users = await AppDataSource.manager.find(Userr)
  console.log("Loaded users: ", users)

  console.log("Here you can setup and run express / fastify / any other framework.")

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => console.log(error))


