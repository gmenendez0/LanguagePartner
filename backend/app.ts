import express from 'express';
import session from 'express-session';
import myRouter from './routes/routes';
import "reflect-metadata";
import { AppDataSource } from "./src/data-source"

// ? Se define la configuración de la sesión.
const sessionOptions: session.SessionOptions = {
  secret: 'yourSecretKey', // ! Firma del token! Debe redefinirse ya que es un secreto!
};

// ? Se extiende la interfaz de la sesión para poder agregar la propiedad user y poder identificarlo via ID.
declare module 'express-session' {
  interface SessionData {
    user: number | null;
  }
}

// ? Se extiende la interfaz de Request para poder agregar la propiedad session.
declare global {
  namespace Express {
    interface Request {
      session: session.Session & Partial<session.SessionData>;
    }
  }
}

const app = express();
app.use(express.json());
app.use(session(sessionOptions));
app.use('/', myRouter);

const PORT = process.env.PORT || 3000;
AppDataSource.initialize().then(async () => {
  // Run all pending migrations
  await AppDataSource.runMigrations({
    transaction: 'all',
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => console.log(error))


