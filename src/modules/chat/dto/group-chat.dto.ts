import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsArray, ValidateNested } from "class-validator";

export class GroupChatDto {
    @IsString()
    @IsNotEmpty()
    name:string;


    @IsArray()
    @ValidateNested({each:true})
    @Type(() => String)
    users:string[];
}
