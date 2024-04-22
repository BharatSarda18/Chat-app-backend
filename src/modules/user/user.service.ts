import { BadRequestException, Injectable, Options, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private UserModel = Model<User>, private jwtService: JwtService) { }
  async create(createUserDto: CreateUserDto) {

    const userExists = await this.UserModel.findOne({ email: createUserDto.email });
    if (userExists) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = { ...createUserDto, password: hashedPassword };

    const newUser = await this.UserModel.create(user);

    const token = await this.jwtService.sign({ id: newUser._id });
    let userWithoutPass = newUser.toObject();
    delete userWithoutPass.password;
    delete userWithoutPass.resetPasswordToken;
    return { token, userWithoutPass };
  }

  async findAll(search: string, user: string) {
    const keyword = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};
    return await this.UserModel.find({ ...keyword, _id: { $ne: user } }).exec();
  }

  async loginUserService(loginUserDto: LoginUserDto) {

    const userExists = await this.UserModel.findOne({ email: loginUserDto.email });
    if (!userExists) {
      throw new BadRequestException("User does not exists");
    } else {
      const isPasswordMatched = await bcrypt.compare(loginUserDto.password, userExists.password);
      if (!isPasswordMatched) {
        throw new UnauthorizedException("Password did not match");
      }
      const token = this.jwtService.sign({ id: userExists._id });
      const { password, resetPasswordToken, ...userWithoutPass } = userExists.toObject();
      return { token, userWithoutPass };
    }
  }

  async findById(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw new BadRequestException("User did not match");
    }
    const { resetPasswordToken, password, ...userObject } = user.toObject();
    return userObject;
  }

  async findByIdWithoutDeletePass(id: string) {
    return await this.UserModel.findById(id);
  }

}
