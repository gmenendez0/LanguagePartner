import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../src/entity/User';
import { Language } from '../src/entity/Language';
import { UserRepository } from '../src/repository/UserRepository';
import '../app'
import { AppDataSource } from '../src/data-source';

export const addLanguages = async (req: Request, res: Response) => {

  const langRepository = AppDataSource.getRepository(Language)
  const count = await langRepository.count();
  if (count > 0) {
    return res.status(500).json({ message: 'Error adding languages' });
  }

  const languages = [
    "Spanish",
    "English",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Dutch",
    "Russian",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
    "Bengali",
    "Urdu",
    "Turkish",
    "Vietnamese",
    "Thai",
    "Swedish",
    "Danish",
    "Norwegian",
    "Finnish",
    "Polish",
    "Czech",
    "Slovak"
  ]

  for (const language of languages) {
    const newLanguage = new Language();
    newLanguage.name = language;
    langRepository.save(newLanguage);
  }
  return res.status(200).json({ message: 'Languages added' });
}

export const getLanguages = async (req: Request, res: Response) => {
  const langRepository = AppDataSource.getRepository(Language)
  const languages = await langRepository.query('SELECT * FROM language');
  return res.status(200).json(languages);
}