import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type UserDocument=HydratedDocument<User>;
@Schema({timestamps:true})
export class User {

    @Prop({required:true})
    name:string;

    @Prop({required:true,unique:true})
    email:string;

    @Prop({required:true})
    password:string;

    @Prop({required:true,default:'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'})
    pic:string;

    @Prop({required:true,default:false})
    isAdmin:boolean;
}

export const UserSchema=SchemaFactory.createForClass(User);
