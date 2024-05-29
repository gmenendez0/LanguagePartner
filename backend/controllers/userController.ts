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
  const user = await userRepository.findOne({
    where: { id: req.session.user },
    relations: ["knownLanguages", "wantToKnowLanguages"],
  });
  const lang = await AppDataSource.getRepository(Language).findOneBy({name: language})
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!lang) {
    return res.status(404).json({ message: 'Language not found' });
  }

  if (user.knownLanguages.includes(lang)) {
    return res.status(400).json({ message: 'Language already added' });
  }

  user.knownLanguages.push(lang);

  userRepository.save(user);
  res.json(user);
};

export const addWantedLanguage = async (req: Request, res: Response) => {
  const { language } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!language) {
    return res.status(400).json({ message: 'Language is required' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;
  const user = await userRepository.findOne({
    where: { id: req.session.user },
    relations: ["knownLanguages", "wantToKnowLanguages"],
  });
  const lang = await AppDataSource.getRepository(Language).findOneBy({name: language})
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!lang) {
    return res.status(404).json({ message: 'Language not found' });
  }

  if (user.wantToKnowLanguages.includes(lang)) {
    return res.status(400).json({ message: 'Language already added' });
  }

  user.wantToKnowLanguages.push(lang);

  userRepository.save(user);
  res.json(user);
};

export const removeKnownLanguage = async (req: Request, res: Response) => {
  const { language } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!language) {
    return res.status(400).json({ message: 'Language is required' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;
  const user = await userRepository.findOne({
    where: { id: req.session.user },
    relations: ["knownLanguages", "wantToKnowLanguages"],
  });
  const lang = await AppDataSource.getRepository(Language).findOneBy({name: language})
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!lang) {
    return res.status(404).json({ message: 'Language not found' });
  }

  user.knownLanguages = user.knownLanguages.filter(l => l.id !== lang.id);

  userRepository.save(user);
  res.json(user);
};

export const removeWantedLanguage = async (req: Request, res: Response) => {
  const { language } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!language) {
    return res.status(400).json({ message: 'Language is required' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;
  const user = await userRepository.findOne({
    where: { id: req.session.user },
    relations: ["knownLanguages", "wantToKnowLanguages"],
  });
  const lang = await AppDataSource.getRepository(Language).findOneBy({name: language})
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!lang) {
    return res.status(404).json({ message: 'Language not found' });
  }

  user.wantToKnowLanguages = user.wantToKnowLanguages.filter(l => l.id !== lang.id);

  userRepository.save(user);
  res.json(user);
};

export const myLanguages = async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;
  const user = await userRepository.findOne({
    where: { id: req.session.user },
    relations: ["knownLanguages", "wantToKnowLanguages"],
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    knownLanguages: user.knownLanguages,
    wantToKnowLanguages: user.wantToKnowLanguages,
  });
}