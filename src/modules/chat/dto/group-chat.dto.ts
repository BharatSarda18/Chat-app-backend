import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from "class-validator";

export class GroupChatDto {
    @IsString()
    @IsNotEmpty()
    name: string;



    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(2)
    users: string[];
}
