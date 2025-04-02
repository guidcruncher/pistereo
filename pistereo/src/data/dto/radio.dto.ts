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
}

export type RadioPresetDocument = HydratedDocument<RadioPreset>;
export const RadioPresetSchema = SchemaFactory.createForClass(RadioPreset);
