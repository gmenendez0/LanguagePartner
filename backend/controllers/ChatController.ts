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
      await this.service.addMessage(req.body.message, req.params.id as unknown as number, (req.user as LP_User).getId());
      this.createdResponse(res, { message: 'Message added successfully.' });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public getChat = async (req: Request, res: Response) => {
    try {
      await this.service.getChat(req.params.id as unknown as number, (req.user as LP_User).getId());
      this.okResponse(res, { message: 'Chat retrieved successfully.' });
    } catch (error) {
      this.handleError(error, res);
    }
  }
}

export default new ChatController();