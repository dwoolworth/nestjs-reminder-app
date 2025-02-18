import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema';
import { Note } from 'src/note/note.schema';

export type ReminderDocument = Reminder & Document;

@Schema()
export class Reminder {
  @Prop({ required: true })
  description: string;

  @Prop({ required: false, type: Date, default: Date.now })
  dueDate: Date;

  @Prop({ required: false, default: false })
  status: boolean;

  @Prop({ required: false, default: false })
  priority: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Notes', required: true })
  notes: Note[];
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);
