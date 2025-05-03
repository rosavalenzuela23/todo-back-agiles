import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Task } from '../../tasks/schemas/task.schema';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;
    
    @Prop({ required: true, select: false }) // select: false para no devolverlo en queries
    password: string;

    @Prop({ required: true })
    username: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }], default: [] })
    tasks: Task[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);