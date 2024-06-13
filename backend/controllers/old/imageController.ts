/*

import { Request, Response } from 'express';
import '../app'
import { AppDataSource } from '../src/data-source';
import { UserRepository } from '../src/repository/UserRepository';
import { User } from '../src/entity/User';

const axios = require('axios');
const multer = require('multer');

const TOKEN = 'faf88da0b48658a09e9fce28e6659a3b7c2310ff'

const upload = multer({ storage: multer.memoryStorage() });
export const uploadMiddleware = upload.single('photo');

export const uploadProfilePicture = async (req: Request, res: Response) => {
  const userid = req.session.user;

  if (!userid) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const photo = req.file;

  if (!photo) {
    return res.status(400).json({ message: 'No photo provided' });
  }

  const fileBuffer = photo.buffer;
  const base64Image = fileBuffer.toString('base64');

  const response = await axios.post(
    'https://api.imgur.com/3/image',
    { image: base64Image, type: 'base64' },
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );

  //Si habia una imagen previa, la borro
  if (response.status !== 200) {
    return res.status(response.status).json(response.data);
  } else {

    const userRepository = AppDataSource.getRepository(User) as UserRepository;
    const user = userRepository.findOneBy({ id: userid }).then(user => {
      if (user.profilePicHash) {
        deleteImage(user);
      }
      user.profilePicHash = response.data.data.id;
      userRepository.save(user);
      return res.status(200).json(user);
    });
  }
}

const deleteImage = async (user: User): Promise<Response> => {
  //No checkea si la imagen existe ni guarda el usuario en el repo
  const response = await axios.delete(
    `https://api.imgur.com/3/image/${user.profilePicHash}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
  user.profilePicHash = null;
  return response;
}

export const deleteProfilePicture = async (req: Request, res: Response) => {
  const userid = req.session.user;

  if (!userid) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;
  const user = await userRepository.findOneBy({ id: userid })
  if (!user.profilePicHash) {
    return res.status(404).json({ message: 'No profile picture found' });
  }
  await deleteImage(user);
  userRepository.save(user);
  return res.status(200).json(user);
}

export const getProfilePicture = async (req: Request, res: Response) => {
  const { id } = req.body;
  const userRepository = AppDataSource.getRepository(User) as UserRepository;
  const user = await userRepository.findOneBy({ id });

  if (!user || !user.profilePicHash) {
      return res.status(404).json({ message: 'No profile picture found' });
  }

  const response = await axios.get(
      `https://api.imgur.com/3/image/${user.profilePicHash}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
  );

  return res.status(response.status).json(response.data);
  // The photo is in data.link (response.data.data.link)
}
*/