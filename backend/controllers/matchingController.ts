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

  const user = await userRepository.findOne({
    where: { id: req.session.user },
    relations: ["approvedUsers", "rejectedUsers"],
  });
  
  const matchableUsers = await userRepository.findBy({ city: user.city });

  const filteredUsers = fiterMatchableUsers(user, matchableUsers);

  if (filteredUsers.length > 0) {
    return res.status(200).json(filteredUsers[Math.floor(Math.random() * filteredUsers.length)]);
  } else {
    // Si no hay usuarios posibles, borro la lista de rechazados y vuelvo a intentar
    user.rejectedUsers = [];
    userRepository.save(user);
    const filteredUsers = fiterMatchableUsers(user, matchableUsers);
    if (filteredUsers.length > 0) {
      return res.status(200).json(filteredUsers[Math.floor(Math.random() * filteredUsers.length)]);
    } else {
      return res.status(404).json({ message: 'No matchable users found' });
    }
  }
}

const fiterMatchableUsers = (user: User, matchableUsers: User[]): User[] => {
  // Map approvedUsers and rejectedUsers to arrays of their IDs
  const approvedUserIds = user.approvedUsers.map(approvedUser => approvedUser.id);
  const rejectedUserIds = user.rejectedUsers.map(rejectedUser => rejectedUser.id);

  // Filter matchableUsers by checking IDs against approved and rejected IDs
  return matchableUsers.filter(matchableUser => {
    return (
      !approvedUserIds.includes(matchableUser.id) &&
      !rejectedUserIds.includes(matchableUser.id) &&
      matchableUser.id !== user.id
    );
  });
};

export const approveUser = async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!req.body.userId) {
    return res.status(400).json({ message: 'userId is required' });
  }
  if (req.session.user === req.body.userId) {
    return res.status(400).json({ message: 'You cannot approve yourself' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;

  const user = await userRepository.findOne({
    where: { id: req.session.user },
    relations: ["approvedUsers", "matchedUsers"],
  });
  const userToApprove = await userRepository.findOne({
    where: { id: req.body.userId },
    relations: ["approvedUsers", "matchedUsers"],
  });

  if (!userToApprove) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.approvedUsers.push(userToApprove);

  // Si el usuario aprobado también nos ha aprobado, se produce un match
  if (userToApprove.approvedUsers.map(approvedUser => approvedUser.id).includes(user.id)) {
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
  if (req.session.user === req.body.userId) {
    return res.status(400).json({ message: 'You cannot reject yourself' });
  }

  const userRepository = AppDataSource.getRepository(User) as UserRepository;

  const user = await userRepository.findOne({
    where: { id: req.session.user },
    relations: ["rejectedUsers"],
  });
  const userToReject = await userRepository.findOneBy({ id: req.body.userId });

  if (!userToReject) {
    return res.status(404).json({ message: 'User not found' });
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

  const user = await userRepository.findOne({
    where: { id: req.session.user },
    relations: ["approvedUsers", "rejectedUsers", "matchedUsers"],
  });

  return res.status(200).json(
    {
      approvedUsers: user.approvedUsers,
      rejectedUsers: user.rejectedUsers,
      matchedUsers: user.matchedUsers
    }
  );
}