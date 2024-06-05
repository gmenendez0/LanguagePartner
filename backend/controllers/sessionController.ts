/*

import { Request, Response } from 'express';
import { User } from '../src/entity/User';
import '../app'
import { AppDataSource } from '../src/data-source';
import { UserRepository } from '../src/repository/UserRepository';

export const register = (req: Request, res: Response) => {
  const { city, name, email, password } = req.body;

  if (!city || !name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newUser = new User();
  newUser.city = city;
  newUser.name = name;
  newUser.email = email;
  newUser.password = password;
  newUser.profilePicHash = null;
  newUser.approvedUsers = [];
  newUser.rejectedUsers = [];
  newUser.matchedUsers = [];
  newUser.knownLanguages = [];
  newUser.wantToKnowLanguages = [];

  const userRepository = AppDataSource.getRepository(User) as UserRepository;

  userRepository.save(newUser);
  res.status(201).json(newUser);
};
  
export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;
  const user = userRepository.findOneBy({ email }).then(user => {
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.user = user.id;
    res.json(user);
  });
};

export const me = async (req: Request, res: Response) => {
  
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;
  const user = await userRepository.findOneBy({ id: req.session.user })
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};

export const logout = (req: Request, res: Response) => {
  req.session.user = null;
  res.json({ message: 'Logged out successfully' });
};

*/