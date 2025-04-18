import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { UserProfile } from './userprofile.dto';

@Schema()
export class User {
  @Prop({ index: true })
  user: string;

  @Prop({ index: true, default: '' })
  id: string;

  @Prop({ default: '', index: true })
  token: string;

  @Prop({ default: '' })
  refreshtoken: string;

  @Prop({ type: Object })
  profile: UserProfile;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date, default: Date.now })
  lastAccess: Date;

  @Prop({ type: Date })
  expires: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
