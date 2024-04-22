import { IsString, IsNotEmpty } from "class-validator";

export class RemoveGroupDto {
    @IsString()
    @IsNotEmpty()
    chatId:string;

  
    @IsString()
    @IsNotEmpty()
    userId:string;
}