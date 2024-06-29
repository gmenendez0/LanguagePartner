import '../app'
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import { LP_User } from '../src/entity/User/LP_User';
import { chatRepository, ChatRepository } from "../src/repository/ChatRepository";

export class ChatService {
    private chatRepository: ChatRepository;

    constructor() {
        this.chatRepository = chatRepository;
    }

    /**
     * Retrieves a chat via the id's of the users.
     * @param message - the message to be added
     * @param user1 - one of the user's id, the one who sends the message
     * @param user2 - the other user's id
     */
    public addMessage = async (message: string, user1: number, user2: number) => {
        if (!message) throw new InvalidArgumentsError('Message cannot be empty.');
        return await this.chatRepository.addMessage(message, user1, user2);
    }

    /**
     * Retrieves a chat via the id's of the users.
     * @param user1 - one of the user's id
     * @param user2 - the other user's id
     * @returns A promise that resolves with the chat between the two users, or an empty chat if not found.
     */
    public getChat = async (user1: number, user2: number) => {
        return await this.chatRepository.getChat(user1, user2);
    }

    /**
     * Retrieves a chat list for a user.
     * @param user - the user to get the chat list for
     * @returns A promise that resolves with the chat list for the user.
     */
    public getChatList = async (user: LP_User) => {
        return await this.chatRepository.getChatList(user);
    }
}

export const chatService = new ChatService();