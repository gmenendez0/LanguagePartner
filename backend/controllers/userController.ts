import { Request, Response } from 'express';
import { UserRepository } from '../src/repository/UserRepository';
import { User } from '../src/entity/User';
import '../app'
import { Language } from '../src/entity/Language';
import { AppDataSource } from '../src/data-source';

export const addKnownLanguage = async (req: Request, res: Response) => {
  const { language } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!language) {
    return res.status(400).json({ message: 'Language is required' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;
  const user = userRepository.findOneBy({id: req.session.user}).then(user => {
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const lang = AppDataSource.getRepository(Language).findOneBy({name: language}).then(lang => {
      if (!lang) {
        return res.status(404).json({ message: 'Language not found' });
      }
      user.knownLanguages.push(lang);
    });

    userRepository.save(user);
    res.json(user);
  });
};
/*
export const addWantedLanguage = (req: Request, res: Response) => {
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

export const removeKnownLanguage = (req: Request, res: Response) => {
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

export const removeWantedLanguage = (req: Request, res: Response) => {
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
};*/