import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import userRepository from '../repo/userRepository';
import User from '../model/user';
import '../app'
/*
export const getMatchableUser = (req: Request, res: Response) => {
  const user = req.session.user;
  
  if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const matchableUsers = userRepository.getUsersFromCity(user.city);

  const filteredUsers = fiterMatchableUsers(user, matchableUsers);

  if (filteredUsers.length > 0) {
    return res.status(200).json(filteredUsers[Math.floor(Math.random() * filteredUsers.length)]);
  } else {
    // Si no hay usuarios posibles, borro la lista de rechazados y vuelvo a intentar
    user.rejected = [];
    const filteredUsers = fiterMatchableUsers(user, matchableUsers);
    if (filteredUsers.length > 0) {
      return res.status(200).json(filteredUsers[Math.floor(Math.random() * filteredUsers.length)]);
    } else {
      return res.status(404).json({ message: 'No matchable users found' });
    }
  }
}

const fiterMatchableUsers = (user: User, matchableUsers: User[]) => {
  return matchableUsers.filter(matchableUser => {
    return !user.approved.includes(matchableUser.id) &&
           !user.rejected.includes(matchableUser.id) &&
           matchableUser.id !== user.id;
  });
}

export const approveUser = (req: Request, res: Response) => {
  const user = req.session.user;
  const { userId } = req.body;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  if (!user.approved.includes(userId)) {
    user.approved.push(userId);
  }

  // Si el usuario aprobado también nos ha aprobado, se produce un match
  if (userRepository.getUser(userId)?.approved.includes(user.id)) {
    user.matched.push(userId);
    userRepository.getUser(userId)?.matched.push(user.id);
    // Logica de crear chats??
  }

  userRepository.saveUser(user);
  res.json(user);
}

export const rejectUser = (req: Request, res: Response) => {
  const user = req.session.user;
  const { userId } = req.body;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  if (!user.rejected.includes(userId)) {
    user.rejected.push(userId);
  }

  userRepository.saveUser(user);
  res.json(user);
}*/