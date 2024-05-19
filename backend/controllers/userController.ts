import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import userRepository from '../repo/userRepository';
import User from '../model/user'; // Adjust the path
import '../app'

export const AddKnownLanguage = (req: Request, res: Response) => {
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
};

export const AddWantedLanguage = (req: Request, res: Response) => {
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
};

export const RemoveKnownLanguage = (req: Request, res: Response) => {
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
};

export const RemoveWantedLanguage = (req: Request, res: Response) => {
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
};