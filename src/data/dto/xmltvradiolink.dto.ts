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

  @Prop({ type: Boolean, default: true })
  automap: boolean;
}

@Schema()
export class Epg {
  @Prop({ index: true })
  channel: string;

  @Prop()
  title: string;

  @Prop()
  desc: string;

  @Prop()
  icon: string;

  @Prop({ type: Date })
  start: Date;

  @Prop({ type: Date })
  stop: Date;
}

export class EpgData {
  programs: Epg[];

  channels: any[];
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

export type EpgDocument = HydratedDocument<Epg>;
export const EpgSchema = SchemaFactory.createForClass(Epg);
