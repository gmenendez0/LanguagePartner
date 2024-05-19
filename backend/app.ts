import express, { Request, Response } from 'express';
import session from 'express-session';
import User from './model/user';
import myRouter from './routes/routes';

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

