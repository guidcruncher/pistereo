import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { TrackView } from './lastplayed.dto';

@Schema()
export class PlaybackHistory {
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

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date })
  finished: Date;
}

export type PlaybackHistoryDocument = HydratedDocument<PlaybackHistory>;
export const PlaybackHistorySchema =
  SchemaFactory.createForClass(PlaybackHistory);
