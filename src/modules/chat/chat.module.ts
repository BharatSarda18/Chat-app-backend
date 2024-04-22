import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './entities/chat.entity';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[
    PassportModule.register({defaultStrategy:"jwt"}),
    UserModule,
    MongooseModule.forFeature([
      {name:Chat.name,schema:ChatSchema},
      {name:User.name,schema:UserSchema}])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
