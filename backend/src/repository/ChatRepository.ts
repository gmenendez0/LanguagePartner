import fs from 'fs';
import { LP_User } from '../entity/User/LP_User';
import { configLoader } from 'tsconfig-paths/lib/config-loader';
import { broadcastMessage } from '../../sockets/chatSocket';
import { broadcastMessageChatView } from '../../sockets/chatViewSocket';

interface Chat {
  user1: number;
  user2: number;
  user1LastSeen?: Date;
  user2LastSeen?: Date;
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

export interface ChatView {
  id: number;
  name: string;
  profilePicHash: string;
  unreadCount: number;
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
  
      // Convert timestamp strings to Date objects
      userData.chats.forEach(chat => {
        chat.messages.forEach(message => {
          message.timestamp = new Date(message.timestamp);
        });
        if (chat.user1LastSeen) chat.user1LastSeen = new Date(chat.user1LastSeen);
        if (chat.user2LastSeen) chat.user2LastSeen = new Date(chat.user2LastSeen);
      });
  
      return userData.chats;
    } catch (error) {
      console.error("Failed to load chats:", error);
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
    broadcastMessageChatView(user1, user2);
    this.saveChats();
  }

  public getChat = async (user1: number, user2: number) => {
    const chat = this.chats.find((chat) => (chat.user1 === user1 && chat.user2 === user2) || (chat.user1 === user2 && chat.user2 === user1));
    return chat || { user1, user2, messages: [] };
  }

  public getChatList = async (user: LP_User) => {
    const chatlist : ChatView[] = await Promise.all(user.getMatchedUsers().map(async (matchedUser) => ({
      id: matchedUser.getId(),
      name: matchedUser.getName(),
      profilePicHash: matchedUser.getProfilePicHash(),
      unreadCount: await this.getUnreadCount(user.getId(), matchedUser.getId())
    })));

    chatlist.sort((a, b) => {
      const chatA = this.chats.find(chat => (chat.user1 === user.getId() && chat.user2 === a.id) || (chat.user1 === a.id && chat.user2 === user.getId()));
      const chatB = this.chats.find(chat => (chat.user1 === user.getId() && chat.user2 === b.id) || (chat.user1 === b.id && chat.user2 === user.getId()));
    
      if (!chatA && chatB) return 1;
      if (chatA && !chatB) return -1;
      if (!chatA && !chatB) return 0;
    
      const lastMessageA = chatA.messages[chatA.messages.length - 1];
      const lastMessageB = chatB.messages[chatB.messages.length - 1];
    
      if (!lastMessageA && lastMessageB) return 1;
      if (lastMessageA && !lastMessageB) return -1;
      if (!lastMessageA && !lastMessageB) return 0;
    
      const timestampA = new Date(lastMessageA.timestamp);
      const timestampB = new Date(lastMessageB.timestamp);
    
      return timestampB.getTime() - timestampA.getTime();
    });

    return { user: user, chatlist: chatlist };
  }

  public getUnreadCount = async (user1: number, user2: number) => {
    const chat = this.chats.find((chat) => (chat.user1 === user1 && chat.user2 === user2) || (chat.user1 === user2 && chat.user2 === user1));
    if (!chat) {
      return 0;
    }
    const lastSeen = user1 === chat.user1 ? chat.user1LastSeen : chat.user2LastSeen;
    if (!lastSeen) {
      return chat.messages.filter((message) => message.from === user2).length;
    }
    return chat.messages.filter((message) => message.from === user2 && message.timestamp > lastSeen).length;
  }

  public setLastSeen = async (user1: number, user2: number) => {
    const chat = this.chats.find((chat) => (chat.user1 === user1 && chat.user2 === user2) || (chat.user1 === user2 && chat.user2 === user1));
    if (chat) {
      if (user1 === chat.user1) {
        chat.user1LastSeen = new Date();
      } else {
        chat.user2LastSeen = new Date();
      }
      this.saveChats();
    }
  }
};


export const chatRepository = new ChatRepository();