// socket.gateway.ts
import { ConfigService } from '@nestjs/config';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ENV } from 'src/envSchema';


@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class SocketGateway {
  constructor(private readonly configService: ConfigService) {
    console.log(configService.get(ENV.ALLOW_ORIGIN),"ENV.ALLOW_ORIGIN")
  }
  @WebSocketServer() server: Server;

  @SubscribeMessage('setup')
  handleSetup(client: Socket, userData: any): void {
    client.join(userData._id);
    client.emit('connected');
  }

  @SubscribeMessage('join chat')
  handleJoinChat(client: Socket, room: string): void {
    client.join(room);
    console.log(`User Joined Room: ${room}`);
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, room: string): void {
    client.in(room).emit('typing');
  }

  @SubscribeMessage('stop typing')
  handleStopTyping(client: Socket, room: string): void {
    client.in(room).emit('stop typing');
  }

  @SubscribeMessage('new message')
  handleNewMessage(client: Socket, newMessageRecieved: any): void {
    const chat = newMessageRecieved.data.chat;
    const sender = newMessageRecieved.data.sender;

    if (!chat || !chat.users || !sender || !sender._id) {
        console.log('Chat, chat.users, or sender._id is undefined');
        return;
    }

    chat.users.forEach((user: any) => {
      if (user._id == sender._id) return;

      this.server.to(user._id).emit('message recieved', newMessageRecieved);
    });
  }

  
}
