import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './envSchema';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptor/response/response.interceptor';
import { SocketGateway } from './modules/socket.gateway';
import { getConfiguration } from './config/configration';
import { DatabaseModule } from './config/database/database.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      isGlobal: true,
      load: [getConfiguration],
      envFilePath: [`env/.env.${process.env.NODE_ENV}`],
      expandVariables: true,
    }),
    DatabaseModule,
    ChatModule,
    MessageModule,
    UserModule
  ],
    
  controllers: [AppController],
  providers: [AppService, SocketGateway,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }
