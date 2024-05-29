import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../src/entity/User';
import { UserRepository } from '../src/repository/UserRepository';
import '../app'
import { AppDataSource } from '../src/data-source';


export const getMatchableUser = async (req: Request, res: Response) => {
  
  if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;

  const user = await userRepository.findOneBy({ id: req.session.user });
  
  const matchableUsers = await userRepository.findBy({ city: user.city });

  const filteredUsers = fiterMatchableUsers(user, matchableUsers);

  if (filteredUsers.length > 0) {
    return res.status(200).json(filteredUsers[Math.floor(Math.random() * filteredUsers.length)]);
  } else {
    // Si no hay usuarios posibles, borro la lista de rechazados y vuelvo a intentar
    user.rejectedUsers = [];
    const filteredUsers = fiterMatchableUsers(user, matchableUsers);
    if (filteredUsers.length > 0) {
      return res.status(200).json(filteredUsers[Math.floor(Math.random() * filteredUsers.length)]);
    } else {
      return res.status(404).json({ message: 'No matchable users found' });
    }
  }
}

const fiterMatchableUsers = (user: User, matchableUsers: User[]) => {
  if (!matchableUsers) {
    return [];
  }

  return matchableUsers.filter(matchableUser => {
    return (
      (!user.approvedUsers || !user.approvedUsers.includes(matchableUser)) &&
      (!user.rejectedUsers || !user.rejectedUsers.includes(matchableUser)) &&
      matchableUser.id !== user.id
    );
  });
}

export const approveUser = async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!req.body.userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;

  const user = await userRepository.findOneBy({ id: req.session.user });
  const userToApprove = await userRepository.findOneBy({ id: req.body.userId });

  if (!userToApprove) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.approvedUsers.includes(userToApprove)) {
    user.approvedUsers.push(userToApprove);
  }

  // Si el usuario aprobado también nos ha aprobado, se produce un match
  if (userToApprove.approvedUsers.includes(user)) {
    user.matchedUsers.push(userToApprove);
    userToApprove.matchedUsers.push(user);
    // Logica de crear chats??
    userRepository.save(user);
    userRepository.save(userToApprove);
    return res.status(200).json({ message: 'Match Created!' });
  } else {
    userRepository.save(user);
    userRepository.save(userToApprove);
    return res.status(200).json({ message: 'User Approved' });
  }
}

export const rejectUser = async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!req.body.userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;

  const user = await userRepository.findOneBy({ id: req.session.user });
  const userToReject = await userRepository.findOneBy({ id: req.body.userId });

  if (!userToReject) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.approvedUsers.includes(userToReject)) {
    user.approvedUsers.push(userToReject);
  }

  user.rejectedUsers.push(userToReject);
  userRepository.save(user);
  return res.status(200).json({ message: 'User Rejected' });
}

export const getRelationships = async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;

  const user = await userRepository.findOneBy({ id: req.session.user });

  return res.status(200).json(
    {
      approvedUsers: user.approvedUsers,
      rejectedUsers: user.rejectedUsers,
      matchedUsers: user.matchedUsers
    }
  );
}