import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReminderDocument = Reminder & Document;

@Schema()
class Note {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;
}

const NoteSchema = SchemaFactory.createForClass(Note);

@Schema()
export class Reminder {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ default: false })
  priority: boolean;

  @Prop({ default: false })
  status: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [NoteSchema], default: [] })
  notes: Note[];
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);