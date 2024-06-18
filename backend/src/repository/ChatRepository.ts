import fs from 'fs';
const WebSocket = require('ws');
import ws from 'ws';
const server = new WebSocket.Server({ port: 3001 });
import { LP_User } from '../entity/User/LP_User';
import { configLoader } from 'tsconfig-paths/lib/config-loader';

interface Chat {
  user1: number;
  user2: number;
  messages: Message[];
}

interface Message {
  from: number;
  message: string;
  timestamp: Date;
}

interface ChatData {
  chats: Chat[];
}

export class ChatRepository {
  private chats: Chat[];
  CHATS_FILE_PATH = 'chats.json';

  constructor() {
    this.chats = this.loadChats();
  }

  private loadChats(): Chat[] {
    try {
      const data = fs.readFileSync(this.CHATS_FILE_PATH, 'utf-8');
      const userData: ChatData = JSON.parse(data);
      return userData.chats;
    } catch (error) {
      return [];
    }
  }

  private saveChats() {
    const data: ChatData = { chats: this.chats };
    fs.writeFileSync(this.CHATS_FILE_PATH, JSON.stringify(data));
  }

  public addMessage = async (message: string, user1: number, user2: number) => {
    const chat = this.chats.find((chat) => (chat.user1 === user1 && chat.user2 === user2) || (chat.user1 === user2 && chat.user2 === user1));
    if (!chat) {
      this.chats.push({ user1, user2, messages: [{ from: user2, message, timestamp: new Date() }] });
    } else {
      chat.messages.push({ from: user2, message, timestamp: new Date() });
    }
    broadcastMessage({ from: user2, message, timestamp: new Date(), to: user1 });
    this.saveChats();
  }

  public getChat = async (user1: number, user2: number) => {
    const chat = this.chats.find((chat) => (chat.user1 === user1 && chat.user2 === user2) || (chat.user1 === user2 && chat.user2 === user1));
    return chat || { user1, user2, messages: [] };
  }
};

interface MessageBroadcast {
  from: number;
  message: string;
  timestamp: Date;
  to: number;
}

function broadcastMessage(message: MessageBroadcast) {
  clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.user === message.to) {
          client.send(JSON.stringify(message));
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

export const chatRepository = new ChatRepository();