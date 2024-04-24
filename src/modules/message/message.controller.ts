import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard())
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto,@Req() req) {
    const user=req.user._id;
    return this.messageService.create(createMessageDto,user);
  }

  @Get()
  findAll(@Query('chat') chat:string) {
    return this.messageService.findAll(chat);
  }


}
