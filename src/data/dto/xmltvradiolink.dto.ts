import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class XmlTvRadioLink {
  @Prop({ index: true, default: '' })
  xmltv_id: string;

  @Prop({ index: true, default: '' })
  stationuuid: string;

  @Prop()
  name: string;

  @Prop()
  epgname: string;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date })
  updated: Date;
}

@Schema()
export class Channel {
  @Prop()
  src: string;

  @Prop()
  lang: string;

  @Prop({ index: true })
  xmltv_id: string;

  @Prop()
  provider_id: string;

  @Prop()
  icon_url: string;

  @Prop({ index: true })
  name: string;
}

export type XmlTvRadioLinkDocument = HydratedDocument<XmlTvRadioLink>;
export const XmlTvRadioLinkSchema =
  SchemaFactory.createForClass(XmlTvRadioLink);

export type ChannelDocument = HydratedDocument<Channel>;
export const ChannelSchema = SchemaFactory.createForClass(Channel);
