import { Socket } from "socket.io";
import { Message } from "../model/message.model";

export interface ISocketService {
    handleConnection(socket: Socket): void;
    broadcastMessage(message: Message): void;
    sendMessageToRoom(message: Message,room:string): void;
}