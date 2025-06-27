// src/service/socket.service.ts
import { Server, Socket } from 'socket.io';
import { Message } from '../model/message.model';
import { ISocketService } from './ISocketService';
import { Room } from '../model/room.model';

export class SocketService implements ISocketService {
  
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public sendMessageToRoom(message: any, room:string): void {
    const messageMetadata = message.getMetadata()
    this.io.emit(room, messageMetadata );
  }

  public handleConnection(socket: Socket): void {
    console.log(`Cliente conectado: ${socket.id}`);
  }

  public sendMessageToUser(userId: string, message: string): void {
    this.io.to(userId).emit('new-message', { message });
  }

  public broadcastMessage(message: Message): void {
    const messageMetadata = message.getMetadata()
    this.io.emit('broadcast', messageMetadata );
  }

  public refreshStock(message: Message): void {
    const messageMetadata = message.getMetadata()
    this.io.emit(Room.STOCK_CONTROL, messageMetadata );
  }
}
