

import { Request, Response } from 'express';
import { AppDataSource } from '../../src/data-source';
import { userRepository } from '../../src/repository/UserRepository';
import { LP_User } from '../../src/entity/LP_User/LP_User';
import { Blob } from 'buffer';

const axios = require('axios');
const multer = require('multer');

const TOKEN = 'faf88da0b48658a09e9fce28e6659a3b7c2310ff'

const upload = multer({ storage: multer.memoryStorage() });
export const uploadMiddleware = upload.single('photo');

export const uploadProfilePicture = async (req: Request, res: Response) => {
  const user = req.user as LP_User;
  const photo = req.file;

  if (!photo) {
    return res.status(400).json({ message: 'No photo provided' });
  }

  let response;

  if (photo.mimetype == 'blob') {
    response = await axios.post(
      'https://api.imgur.com/3/image',
      { image: photo, type: 'blob' },
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
  } else {
    const fileBuffer = photo.buffer;
    const base64Image = fileBuffer.toString('base64');

    response = await axios.post(
      'https://api.imgur.com/3/image',
      { image: base64Image, type: 'base64' },
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
  }

  //Si habia una imagen previa, la borro
  if (response.status !== 200) {
    return res.status(response.status).json(response.data);
  } else {
    if (user.getProfilePicHash()) {
      deleteImage(user);
    }
    user.setProfilePicHash(response.data.data.id);
    userRepository.save(user);
    return res.status(200).json(user);
  }
}

const deleteImage = async (user: LP_User): Promise<Response> => {
  //No checkea si la imagen existe ni guarda el usuario en el repo
  const hash = user.getProfilePicHash();
  const response = await axios.delete(
    `https://api.imgur.com/3/image/${hash}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
  user.setProfilePicHash(null)
  return response;
}
