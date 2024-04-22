import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Chat } from "src/modules/chat/entities/chat.entity";
import { User } from "src/modules/user/entities/user.entity";


export type MessageDocument=HydratedDocument<Message>

@Schema({timestamps:true})
export class Message {
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
    sender:User;

    @Prop({trim:true})
    content:string;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'Chat'})
    chat:Chat;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
    readBy:User
}

export const MessageSchema=SchemaFactory.createForClass(Message)
