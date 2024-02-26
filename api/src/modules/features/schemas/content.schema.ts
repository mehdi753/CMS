import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { I18nText } from 'src/@types/language';

@Schema()
export class Content {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  title: I18nText;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  description: I18nText;

  @Prop([String])
  images: string[];
}

export const ContentSchema = SchemaFactory.createForClass(Content);
