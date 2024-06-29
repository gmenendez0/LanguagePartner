import {Controller} from "./Controller";
import {Request, Response} from "express";
import { LP_User } from "../src/entity/User/LP_User";
import {chatService, ChatService} from "../service/ChatService";

class ChatController extends Controller {
  private service: ChatService;

  constructor() {
    super();
    this.service = chatService;
  }

  public addMessage = async (req: Request, res: Response) => {
    try {
      await this.service.addMessage(req.body.message, Number(req.params.id), (req.user as LP_User).getId());
      this.createdResponse(res, { message: 'Message added successfully.' });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public getChat = async (req: Request, res: Response) => {
    try {
      const chat = await this.service.getChat(Number(req.params.id), (req.user as LP_User).getId());
      this.okResponse(res, chat);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public getChatList = async (req: Request, res: Response) => {
    try {
      const chats = await this.service.getChatList((req.user as LP_User));
      this.okResponse(res, chats);
    } catch (error) {
      this.handleError(error, res);
    }
  }
}

export default new ChatController();