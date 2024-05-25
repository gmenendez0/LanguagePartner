import { Request, Response } from 'express';
import userRepository from '../repo/userRepository';
import User from '../model/user';
import '../app'

const axios = require('axios');
const multer = require('multer');

const TOKEN = 'faf88da0b48658a09e9fce28e6659a3b7c2310ff'

const upload = multer({ storage: multer.memoryStorage() });
export const uploadMiddleware = upload.single('photo');

export const uploadProfilePicture = async (req: Request, res: Response) => {
  const user = req.session.user;

  if (!user) {
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

  user.profile_picture = response.data.data.id;

  return res.status(200).json(user);
}