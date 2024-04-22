import { IsNotEmpty, IsString } from "class-validator";
import { Chat } from "src/modules/chat/entities/chat.entity";


export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    content:string;


    @IsString()
    @IsNotEmpty()
    chatId:string;
}
