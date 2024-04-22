import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Message } from "src/modules/message/entities/message.entity";
import { User } from "src/modules/user/entities/user.entity";

 export type ChatDocument=HydratedDocument<Chat>
//export type ChatDocument = Chat & Document;

@Schema({timestamps:true})
export class Chat {
   
    @Prop({trim:true})
    chatName:string;

    @Prop({default:false})
    isGroupChat:boolean;

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]})
    users: User[];


    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'Message'})
    latestMessage:Message

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
    groupAdmin:User;

}

export const ChatSchema=SchemaFactory.createForClass(Chat);
