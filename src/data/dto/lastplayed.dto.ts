import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export class TrackView {
  source: string;

  uri: string;

  name: string;

  description: string;

  owner: string;

  image: string;
}

@Schema()
export class LastPlayed {
  @Prop({ index: true })
  user: string;

  @Prop({ default: '' })
  display_name: string;

  @Prop({ default: '' })
  source: string;

  @Prop({ default: '' })
  uri: string;

  @Prop({ default: {}, type: Object })
  detail: TrackView;
}

export type LastPlayedDocument = HydratedDocument<LastPlayed>;
export const LastPlayedSchema = SchemaFactory.createForClass(LastPlayed);
