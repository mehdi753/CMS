import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { FEATURE } from 'src/@types/features';
import { Page } from 'src/modules/pages/schemas/page.schema';

@Schema({ timestamps: true, discriminatorKey: 'name' })
export class Feature extends Document {
  @Prop({
    type: String,
    required: true,
    enum: FEATURE,
  })
  name: FEATURE;
  @Prop({ type: Number, required: true })
  index: number;
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    index: true,
    ref: () => Page.name,
  })
  page: string;
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);

FeatureSchema.index(
  {
    page: 1,
    index: 1,
  },
  { unique: true },
);
