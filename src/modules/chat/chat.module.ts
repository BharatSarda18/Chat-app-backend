import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { Chat, ChatSchema } from './entities/chat.entity';
import { User, UserSchema } from '../user/entities/user.entity';

@Module({
  imports:[
    PassportModule.register({defaultStrategy:"jwt"}),
    UserModule,
    MongooseModule.forFeature([
      {name:Chat.name,schema:ChatSchema},
      {name:User.name,schema:UserSchema}])],
      
  controllers: [ChatController],
  providers: [ChatService],
  exports:[ChatService,ChatModule]
})
export class ChatModule {}
