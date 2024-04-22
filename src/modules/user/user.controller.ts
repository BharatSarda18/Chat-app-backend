import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from "bcryptjs";
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = { name: createUserDto.name, email: createUserDto.email, password: createUserDto.password };
    return await this.userService.create(user);
  }

  @UseGuards(AuthGuard())
  @Get()
  findAll(@Query('search') search: string, @Req() req) {
    const id=req.user._id;
    return this.userService.findAll(search, id);
  }

  @Post('/login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUserService(loginUserDto);
  }


}
