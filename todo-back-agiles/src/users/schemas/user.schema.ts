import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDTO = {
    title: string,
    description: string,
    status: string,
    categoryName: string,
    endDate: Date,
}

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    username: string;

    @Prop()
    tasks: TaskDTO[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);