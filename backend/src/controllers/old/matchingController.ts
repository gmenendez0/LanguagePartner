

import { Request, Response } from 'express';
import { userRepository } from '../../repository/UserRepository';
import { LP_User } from '../../entity/LP_User/LP_User';
import { broadcastMessage } from '../../sockets/matchingSocket';
import { broadcastMessageChatViewMatch } from '../../sockets/chatViewSocket';


export const getMatchableUser = async (req: Request, res: Response) => {

  const user = req.user as LP_User;
  const matchableUsers = await userRepository.getAllUsers();

  let exclude = req.query.exclude;
  let filtered_out_users: Number[];
  if (typeof exclude === 'undefined') {
    filtered_out_users = [];
  } else {
    filtered_out_users = (exclude as string).split(',').map(Number);
  }

  const filteredUsers = fiterMatchableUsers(user, matchableUsers, filtered_out_users);

  if (filteredUsers.length > 0) {
    
    const profile = filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
    return res.status(200).json(profile);

  } else {
    // Si no hay usuarios posibles, borro la lista de rechazados y vuelvo a intentar
    user.removeAllRejectedUsers();
    userRepository.save(user);
    const filteredUsers = fiterMatchableUsers(user, matchableUsers, []);

    if (filteredUsers.length > 0) {

      const profile = filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
      return res.status(200).json(profile);

    } else {
      return res.status(404).json({ message: 'No matchable users found' });
    }
  }
}

const fiterMatchableUsers = (user: LP_User, matchableUsers: LP_User[], filtered: Number[]): LP_User[] => {
  // Map approvedUsers and rejectedUsers to arrays of their IDs
  const approvedUserIds = user.getApprovedUsers().map(approvedUser => approvedUser.getId());
  const rejectedUserIds = user.getRejectedUsers().map(rejectedUser => rejectedUser.getId());
  const myLanguages = user.getKnownLanguages().concat(user.getWantToKnowLanguages()).map(language => language.getId());

  return matchableUsers.filter(matchableUser => {

    const matchableLanguages = matchableUser.getKnownLanguages().concat(matchableUser.getWantToKnowLanguages()).map(language => language.getId());

    return (
      !approvedUserIds.includes(matchableUser.getId()) &&
      !rejectedUserIds.includes(matchableUser.getId()) &&
      !filtered.includes(matchableUser.getId()) &&
      matchableUser.getId() !== user.getId() &&
      matchableLanguages.some(language => myLanguages.includes(language))
    );
  });
};

export const approveUser = async (req: Request, res: Response) => {

  const user = req.user as LP_User;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (user.getId === req.body.userId) {
    return res.status(400).json({ message: 'You cannot approve yourself' });
  }

  const userToApprove = await userRepository.findById(Number(req.params.id));

  if (!userToApprove) {
    return res.status(404).json({ message: 'LP_User not found' });
  }

  user.addApprovedUser(userToApprove);

  // Si el usuario aprobado también nos ha aprobado, se produce un match
  if (userToApprove.approvedUsers.map(approvedUser => approvedUser.id).includes(user.getId())) {

    if (user.getMatchedUsers().map(matchedUser => matchedUser.getId()).includes(userToApprove.getId())) {
      return res.status(200).json({ message: 'Match already exists' });
    }

    user.addMatchedUser(userToApprove);
    userToApprove.addMatchedUser(user);

    broadcastMessage(user.getId(), userToApprove.getId(), user.getName(), userToApprove.getName());
    broadcastMessageChatViewMatch(user, userToApprove);

    userRepository.save(user);
    userRepository.save(userToApprove);

    return res.status(200).json({ message: 'Match Created!' });

  } else {

    userRepository.save(user);
    userRepository.save(userToApprove);

    return res.status(200).json({ message: 'LP_User Approved' });
  }
}

export const rejectUser = async (req: Request, res: Response) => {

  const user = req.user as LP_User;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (user.getId === req.body.userId) {
    return res.status(400).json({ message: 'You cannot approve yourself' });
  }

  const userToReject = await userRepository.findById(Number(req.params.id));

  if (!userToReject) {
    return res.status(404).json({ message: 'LP_User not found' });
  }

  user.addRejectedUser(userToReject);

  userRepository.save(user);
  return res.status(200).json({ message: 'LP_User Rejected' });
}
/*
export const getRelationships = async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userRepository = AppDataSource.getRepository(LP_User) as UserRepository;

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
