import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema';

export type ReminderDocument = Reminder & Document;

@Schema()
class Note {
  @Prop({ required: true })
  title: string;
}

const NoteSchema = SchemaFactory.createForClass(Note);

@Schema()
export class Reminder {
  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  dueDate: Date;

  @Prop({ required: true, default: false })
  status: boolean;

  @Prop({ required: true, default: false })
  priority: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: [NoteSchema], default: [] })
  notes: Note[];
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);
