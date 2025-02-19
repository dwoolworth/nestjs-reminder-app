import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { REMINDER_STATUS } from './enums/reminder.status';

export type ReminderDocument = Reminder & Document;

@Schema()
export class Reminder {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false, type: Date, default: Date.now })
  dueDate: Date;

  @Prop({
    required: true,
    enum: REMINDER_STATUS,
    default: REMINDER_STATUS.PENDING,
  })
  status: REMINDER_STATUS;

  @Prop({ required: false, default: false })
  priority: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Note',
    required: true,
    default: [],
  })
  notes: MongooseSchema.Types.ObjectId[];
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);
