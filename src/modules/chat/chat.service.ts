import { Injectable } from '@nestjs/common';
import { AccessChatDto } from './dto/access-chat.dto';
import { GroupChatDto } from './dto/group-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './entities/chat.entity';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { RenameChatDto } from './dto/rename-chat.dto';
import { RemoveGroupDto } from './dto/remove-group.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private ChatModel = Model<Chat>,
   @InjectModel(User.name) private UserModel = Model<User>,
   private userService:UserService) { }


  async accessChatService(accessChatDto: AccessChatDto, user: string) {
    let isChat = await this.ChatModel.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: user } } },
        { users: { $elemMatch: { $eq: accessChatDto.userId } } },
      ],
    })
     .populate("users", "-password").populate("latestMessage");


    isChat = await this.UserModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    
    if (isChat.length > 0) {
      return isChat[0];
    } else {

      const loginUser= await this.userService.findByIdWithoutDeletePass(user);
      const otherUser = await this.userService.findByIdWithoutDeletePass(accessChatDto.userId);

      const chatData=await new this.ChatModel({
        chatName: "sender",
        isGroupChat: false,
        users: [loginUser,otherUser ],
        latestMessage: null, 
        groupAdmin: loginUser
      })
  
      try {

        const createdChat = await this.ChatModel.create(chatData);
        console.log("ischat",createdChat,chatData);
        const fullChat = await this.ChatModel.findOne({ _id: createdChat._id })
        .populate(
          "users",
          "-password"
        );
        return fullChat;

      } catch (error) {
        throw new Error(error.message);
      }
    }

  }


  async fetchChatsService(user: string) {

    try {
      const results = await this.ChatModel.find({ users: { $elemMatch: { $eq: user } } })
         .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      const populatedResults = await this.UserModel.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
      });

      return populatedResults;

    } catch (error) {
      throw new Error(error?.message);
    }

  }

  async groupChatsService(user: string, groupChatDto: GroupChatDto) {
    console.log(groupChatDto,"groupChatDto");
    let users = groupChatDto.users;
    let UsersAsPerSchema=[];
  
    for (const userId of users) {
      const outputUser = await this.userService.findByIdWithoutDeletePass(userId);
      UsersAsPerSchema.push(outputUser);
    }

    const loginuser=await this.userService.findByIdWithoutDeletePass(user);
    
    UsersAsPerSchema.push(loginuser);

    console.log(UsersAsPerSchema,"UsersAsPerSchema");
    try {
      const groupChat = await this.ChatModel.create({
        chatName: groupChatDto.name,
        users: UsersAsPerSchema,
        isGroupChat: true,
        groupAdmin: user,
      })
      const fullGroupChat = await this.ChatModel.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      return fullGroupChat;
    } catch (error) {
      throw new Error(error.message);
    }

  }

  async renameChatService(user: string, renameChatDto: RenameChatDto) {

    const updatedChat = await this.ChatModel.findByIdAndUpdate(renameChatDto.chatId, {
      chatName: renameChatDto.chatName
    }, { new: true }).populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      throw new Error("Chat Not Found");
    }
    return updatedChat;
  }

  async removeFromGroupService(user: string, removeGroupDto: RemoveGroupDto) {

    const removed = await this.ChatModel.findByIdAndUpdate(
      removeGroupDto.chatId,
      {
        $pull: { users: removeGroupDto.userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      throw new Error("Chat Not Found");
    }
    return removed;
  }

  async AddinGroupService(user: string, removeGroupDto: RemoveGroupDto) {
    const added = await this.ChatModel.findByIdAndUpdate(
      removeGroupDto.chatId,
      {
        $push: { users: removeGroupDto.userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      throw new Error("Chat Not Found");
    }
    return added;
  }

  async findByIdWithoutDeletePass(id: string) {
    return await this.ChatModel.findById(id);
  }

}
