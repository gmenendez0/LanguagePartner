import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import userRepository from '../repo/userRepository';
import User from '../model/user';
import '../app'

export const register = (req: Request, res: Response) => {
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
};
  
export const login = (req: Request, res: Response) => {
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
};

export const me = (req: Request, res: Response) => {
  res.json(req.session.user);
};

export const logout = (req: Request, res: Response) => {
  req.session.user = null;
  res.json({ message: 'Logged out successfully' });
};