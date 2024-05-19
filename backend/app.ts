import express, { Request, Response } from 'express';
import session from 'express-session';
import User from './model/user';
import { UserRepository } from './repo/userRepository';
import { v4 as uuidv4 } from 'uuid';

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

const userRepository = new UserRepository();

app.use(express.json());
app.use(session(sessionOptions));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/register', (req: Request, res: Response) => {
  const { city, name, email, password } = req.body;

  if (!city || !name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newUser: User = {
    id: uuidv4(),
    city,
    name,
    email,
    password,
    approved: [],
    rejected: [],
    matched: [],
    known_languages: [],
    wanted_languages: []
  };

  userRepository.addUser(newUser);
  req.session.user = newUser;
  res.status(201).json(newUser);
});

app.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = userRepository.getUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  req.session.user = user;
  res.json(user);
});

app.get('/me', (req: Request, res: Response) => {
  res.json(req.session.user);
});

app.post('/logout', (req: Request, res: Response) => {
  req.session.user = null;
  res.json({ message: 'Logged out successfully' });
});

app.post('/add_known_language', (req: Request, res: Response) => {
  const { language } = req.body;

  if (!language) {
    return res.status(400).json({ message: 'Language is required' });
  }

  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  user.known_languages.push(language);
  userRepository.saveUser(user);
  res.json(user);
});

app.post('/add_wanted_language', (req: Request, res: Response) => {
  const { language } = req.body;

  if (!language) {
    return res.status(400).json({ message: 'Language is required' });
  }

  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  user.wanted_languages.push(language);
  userRepository.saveUser(user);
  res.json(user);
});

app.post('/remove_known_language', (req: Request, res: Response) => {
  const { language } = req.body;

  if (!language) {
    return res.status(400).json({ message: 'Language is required' });
  }

  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  user.known_languages = user.known_languages.filter(l => l !== language);
  userRepository.saveUser(user);
  res.json(user);
});

app.post('/remove_wanted_language', (req: Request, res: Response) => {
  const { language } = req.body;

  if (!language) {
    return res.status(400).json({ message: 'Language is required' });
  }

  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  user.wanted_languages = user.wanted_languages.filter(l => l !== language);
  userRepository.saveUser(user);
  res.json(user);
});