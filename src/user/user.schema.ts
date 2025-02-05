import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRole } from '../constants/roles';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: string;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: [String], enum: UserRole, default: [UserRole.SUBSCRIBER] })
  roles: UserRole[];

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
