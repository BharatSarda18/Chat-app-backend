import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message,MessageSchema } from './entities/message.entity';
import { PassportModule } from '@nestjs/passport';
import { Chat, ChatSchema } from '../chat/entities/chat.entity';
import { User, UserSchema } from '../user/entities/user.entity';

@Module({
  imports:[
    PassportModule.register({defaultStrategy:"jwt"}),
    MongooseModule.forFeature([{name:Message.name,schema:MessageSchema},
      {name:Chat.name,schema:ChatSchema},
      {name:User.name,schema:UserSchema}
    ])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
