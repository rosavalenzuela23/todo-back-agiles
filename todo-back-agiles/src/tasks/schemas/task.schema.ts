import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum Status {
    PENDIENTE = 'pendiente',
    EN_PROGRESO = 'en_progreso',
    COMPLETADA = 'completada',
}

@Schema({ timestamps: true })
export class Task extends Document {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ enum: Status, default: Status.PENDIENTE })
    status: Status;

    @Prop()
    categoryName: string;

    @Prop({ type: String, ref: 'User', required: true })
    userCreator: string;

    @Prop()
    endDate: Date;
}

export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);