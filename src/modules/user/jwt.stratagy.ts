import { UserService } from './user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV } from 'src/envSchema';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private UserService:UserService, private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:configService.get<string>(ENV.JWT_SECRET)
    });
  }
 
  async validate(payload: any) {

    const {id}=payload;

    const user=await this.UserService.findById(id);

    if(!user){
      throw new UnauthorizedException("user did not find");
    }
    return user;
  }
}