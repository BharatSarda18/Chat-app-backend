import { IsString, IsNotEmpty } from "class-validator";

export class AccessChatDto {

    @IsString()
    @IsNotEmpty()
    userId:string;
}
