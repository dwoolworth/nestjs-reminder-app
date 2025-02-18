import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Reminder } from '../reminder/reminder.schema';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
    @Prop({ required: true })
    title: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Reminder', required: true })
    reminder: Reminder;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
