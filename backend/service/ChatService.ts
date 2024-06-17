import '../app'
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {ChatRepository, chatRepository} from "../src/repository/ChatRepository";

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
     * @returns A promise that resolves with the languages found in the repository, or an empty array if not found.
     */
    public addMessage = async (message: string, user1: number, user2: number) => {
        if (!message) throw new InvalidArgumentsError('Message cannot be empty.');
        return await this.chatRepository.addMessage(message, user1, user2);
    }

    /**
     * Retrieves a chat via the id's of the users.
     * @param user1 - one of the user's id
     * @param user2 - the other user's id
     * @returns A promise that resolves with the languages found in the repository, or an empty array if not found.
     */
    public getChat = async (user1: number, user2: number) => {
        return await this.chatRepository.getChat(user1, user2);
    }
}

export const chatService = new ChatService();