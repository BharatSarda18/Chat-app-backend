import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private MessageModel=Model<Message>){}
  async create(createMessageDto: CreateMessageDto,user:any) {
   // let newMessage=await new this.MessageModel({sender:user,content:createMessageDto.content,chat:createMessageDto.chat});
    // newMessage=await newMessage.populate("sender","name pic")
    return ;
  }

  findAll() {
    return `This action returns all message`;
  }

 
}
