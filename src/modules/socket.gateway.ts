import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
})
export class SocketGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.server = server;
  }

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
  handleNewMessage(client: Socket, newMessageReceived: any): void {
    const chat = newMessageReceived.data.chat;
    const sender = newMessageReceived.data.sender;

    if (!chat || !chat.users || !sender || !sender._id) {
      console.log('Chat, chat.users, or sender._id is undefined');
      return;
    }

    chat.users.forEach((user: any) => {
      if (user._id === sender._id) return;

      this.server.to(user._id).emit('message received', newMessageReceived);
    });
  }
}
