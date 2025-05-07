import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Task } from '../../tasks/schemas/task.schema';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    username: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }], default: [] })
    tasks: Types.ObjectId[];

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);