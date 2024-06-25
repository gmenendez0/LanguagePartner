

import { Request, Response } from 'express';
import { userRepository } from '../../src/repository/UserRepository';
import { LP_User } from '../../src/entity/User/LP_User';


export const getMatchableUser = async (req: Request, res: Response) => {

  const user = req.user as LP_User;
  
  const matchableUsers = await userRepository.find();

  const filteredUsers = fiterMatchableUsers(user, matchableUsers);

  if (filteredUsers.length > 0) {
    return res.status(200).json(filteredUsers[Math.floor(Math.random() * filteredUsers.length)]);
  } else {
    // Si no hay usuarios posibles, borro la lista de rechazados y vuelvo a intentar
    user.removeAllRejectedUsers();
    userRepository.save(user);
    const filteredUsers = fiterMatchableUsers(user, matchableUsers);
    if (filteredUsers.length > 0) {
      return res.status(200).json(filteredUsers[Math.floor(Math.random() * filteredUsers.length)]);
    } else {
      return res.status(404).json({ message: 'No matchable users found' });
    }
  }
}

const fiterMatchableUsers = (user: LP_User, matchableUsers: LP_User[]): LP_User[] => {
  // Map approvedUsers and rejectedUsers to arrays of their IDs
  const approvedUserIds = user.getApprovedUsers().map(approvedUser => approvedUser.getId());
  const rejectedUserIds = user.getRejectedUsers().map(rejectedUser => rejectedUser.getId());

  // Filter matchableUsers by checking IDs against approved and rejected IDs
  return matchableUsers.filter(matchableUser => {
    return (
      !approvedUserIds.includes(matchableUser.getId()) &&
      !rejectedUserIds.includes(matchableUser.getId()) &&
      matchableUser.getId() !== user.getId()
    );
  });
};

export const approveUser = async (req: Request, res: Response) => {

  const user = req.user as LP_User;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!req.body.userId) {
    return res.status(400).json({ message: 'userId is required' });
  }
  if (user.getId === req.body.userId) {
    return res.status(400).json({ message: 'You cannot approve yourself' });
  }

  const userToApprove = await userRepository.findById(Number(req.params.id));

  if (!userToApprove) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.addApprovedUser(userToApprove);

  // Si el usuario aprobado también nos ha aprobado, se produce un match
  if (userToApprove.approvedUsers.map(approvedUser => approvedUser.id).includes(user.getId())) {

    user.addMatchedUser(userToApprove);
    userToApprove.addMatchedUser(user);

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
  
  const user = req.user as LP_User;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!req.body.userId) {
    return res.status(400).json({ message: 'userId is required' });
  }
  if (user.getId === req.body.userId) {
    return res.status(400).json({ message: 'You cannot approve yourself' });
  }

  const userToReject = await userRepository.findById(Number(req.params.id));

  if (!userToReject) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.addRejectedUser(userToReject);

  userRepository.save(user);
  return res.status(200).json({ message: 'User Rejected' });
}
/*
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
}*/
