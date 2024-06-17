import fs from 'fs';

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
      this.chats.push({ user1, user2, messages: [{ from: user1, message, timestamp: new Date() }] });
    } else {
      chat.messages.push({ from: user1, message, timestamp: new Date() });
    }
    this.saveChats();
  }

  public getChat = async (user1: number, user2: number) => {
    const chat = this.chats.find((chat) => (chat.user1 === user1 && chat.user2 === user2) || (chat.user1 === user2 && chat.user2 === user1));
    return chat || { user1, user2, messages: [] };
  }
};

export const chatRepository = new ChatRepository();