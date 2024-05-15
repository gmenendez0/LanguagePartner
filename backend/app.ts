import express, { Request, Response } from 'express';
import User from './model/user';
import { UserRepository } from './repo/userRepository';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;

const userRepository = new UserRepository();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/users/new', (req: Request, res: Response) => {
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
    };
  
    userRepository.addUser(newUser);
    res.status(201).json(newUser);
});