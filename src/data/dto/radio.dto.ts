import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class RadioPreset {
  @Prop({ index: true, default: '' })
  id: string;

  @Prop({ default: '' })
  stationuuid: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ type: Object })
  info: any;

  @Prop({ default: 'radiobrowser' })
  database: string;
}

@Schema()
export class Stream {
  @Prop({ index: true })
  stationuuid: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  url_resolved: string;

  @Prop({ default: '' })
  favicon: string;

  @Prop({ default: 'local' })
  database: string;
}

export type RadioPresetDocument = HydratedDocument<RadioPreset>;
export const RadioPresetSchema = SchemaFactory.createForClass(RadioPreset);

export type StreamDocument = HydratedDocument<Stream>;
export const StreamSchema = SchemaFactory.createForClass(Stream);
