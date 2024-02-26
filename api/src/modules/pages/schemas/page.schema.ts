import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Website } from 'src/modules/websites/schemas/website.schema';

@Schema({ timestamps: true })
export class Page extends Document {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: () => Website.name })
  website: string;
  @Prop({ type: Number, required: true, default: 0 })
  index: number;
}

export const PageSchema = SchemaFactory.createForClass(Page);
PageSchema.index({ name: 1, website: 1 }, { unique: true });
PageSchema.index({ website: 1, index: 1 }, { unique: true });
