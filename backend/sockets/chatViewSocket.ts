const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3003 });
import { LP_User } from '../entity/LP_User/LP_User';
import { ChatView } from '../repository/ChatRepository';

export function broadcastMessageChatView(user1: number, user2: number) {
  clients.forEach(client => {
    if (client.user === user1 && client.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: 'chat',
        from: user2,
      });
      client.send(message)
    }
    if (client.user === user2 && client.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: 'chat',
        from: user1,
      });
      client.send(message)
    }
  });
}

export function broadcastMessageChatViewMatch(user1: LP_User, user2: LP_User) {
  clients.forEach(client => {
    if (client.user === user1.getId() && client.readyState === WebSocket.OPEN) {
      const chatview : ChatView = {
        id: user2.getId(),
        name: user2.getName(),
        profilePicHash: user2.getProfilePicHash(),
        unreadCount: 0
      }
      const message = JSON.stringify({
        type: 'match',
        chatview: chatview,
      });
      client.send(message)
    }
    if (client.user === user2.getId() && client.readyState === WebSocket.OPEN) {
      const chatview : ChatView = {
        id: user1.getId(),
        name: user1.getName(),
        profilePicHash: user1.getProfilePicHash(),
        unreadCount: 0
      }
      const message = JSON.stringify({
        type: 'match',
        chatview: chatview,
      });
      client.send(message)
    }
  });
}

let clients = []; // Map of user id to WebSocket connection

server.on('connection', ws => {
  ws.on('message', message => {
      (ws as any).user = Number(message);
  });
  clients.push(ws);

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});
