import { IsString, IsNotEmpty } from "class-validator";

export class RenameChatDto {
    @IsString()
    @IsNotEmpty()
    chatId:string;

  
    @IsString()
    @IsNotEmpty()
    chatName:string;
}