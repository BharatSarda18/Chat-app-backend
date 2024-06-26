import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { MongooseError } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV, validationSchema } from './envSchema';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptor/response/response.interceptor';
import { SocketGateway } from './modules/socket.gateway';

const envFilePath = `${process.cwd()}/env/.env.${process.env.NODE_ENV}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get(ENV.MONGOURI)
      }),
      inject: [ConfigService]

    }),
    ChatModule, MessageModule, UserModule],
  controllers: [AppController],
  providers: [AppService,SocketGateway,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }
