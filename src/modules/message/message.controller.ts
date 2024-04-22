import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto,@Req() req) {
    const user=req.user._id;
    return this.messageService.create(createMessageDto,user);
  }

  @Get()
  findAll(@Param('chatId') chatId:string) {
    return this.messageService.findAll();
  }


}
