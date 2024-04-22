import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessChatDto } from './dto/access-chat.dto';
import { GroupChatDto } from './dto/group-chat.dto';
import { AuthGuard } from '@nestjs/passport';
import { RenameChatDto } from './dto/rename-chat.dto';
import { RemoveGroupDto } from './dto/remove-group.dto';

@UseGuards(AuthGuard())
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }


  //accesschats
  @Post()
  findAllAccessChats(@Body() accessChatDto: AccessChatDto, @Req() req) {
    const user = req.user._id;
    return this.chatService.accessChatService(accessChatDto, user);
  }


  //fetchchats
  @Get()
  findAll(@Req() req) {
    const user = req.user._id;
    return this.chatService.fetchChatsService(user);
  }

  //creategroupchat
  @Post('/group')
  creategGroupChat(@Req() req, @Body() groupChatDto: GroupChatDto) {
    const user = req.user._id;
   
    return this.chatService.groupChatsService(user, groupChatDto);
  }

  @Put('/rename')
  renameGroup(@Req() req, @Body() renameChatDto: RenameChatDto) {
    const user = req.user._id;
    return this.chatService.renameChatService(user, renameChatDto);

  }

  @Put('/groupremove')
  removeFromGroup(@Req() req, @Body() removeGroupDto: RemoveGroupDto) {
    const user = req.user._id;
    return this.chatService.removeFromGroupService(user, removeGroupDto);
  }

  @Put('/groupadd')
  addToGroup(@Req() req, @Body() removeGroupDto: RemoveGroupDto) {
    const user = req.user._id;
    return this.chatService.AddinGroupService(user, removeGroupDto);
  }




}
