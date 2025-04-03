import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class XmlTvRadioLink {
  @Prop({ index: true, default: '' })
  xmltv_id: string;

  @Prop({ index: true, default: '' })
  stationuuid: string;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date })
  updated: Date;
}

export interface Channel {
  src: string;
  lang: string;
  xmltv_id: string;
  provider_id: string;
  icon_url: string;
  name: string;
}

export type XmlTvRadioLinkDocument = HydratedDocument<XmlTvRadioLink>;
export const XmlTvRadioLinkSchema =
  SchemaFactory.createForClass(XmlTvRadioLink);
