import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { Chat } from '../chat/entities/chat.entity';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private MessageModel = Model<Message>,
    @InjectModel(User.name) private UserModel = Model<User>,
    @InjectModel(Chat.name) private ChatModel = Model<Chat>,
   private userService:UserService,
   private chatService:ChatService
  ) { }
  async create(createMessageDto: CreateMessageDto, user: any) {
    const senderUser=await this.userService.findByIdWithoutDeletePass(user);
    const chatUser=await this.chatService.findByIdWithoutDeletePass(createMessageDto.chatId);
    console.log(chatUser,"chatUserchatUser")
    let newMessage =await new this.MessageModel({
      sender: senderUser,
      content: createMessageDto.content,
      chat: chatUser,
      readBy:senderUser
    });



    try {
      let message = await this.MessageModel.create(newMessage);

      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await this.UserModel.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });

      await this.ChatModel.findByIdAndUpdate(createMessageDto.chatId, { latestMessage: message });

      return message;
    } catch (error) {
      throw new Error(error.message);
    }
    
  }

  async findAll(chatId: string) {
    try {
      const messages = await this.MessageModel.find({ chat: chatId })
        .populate("sender", "name pic email")
        .populate("chat");
      return messages;
    } catch (error) {
      throw new Error(error.message);
    }
  }


}
