import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Validators } from 'src/utils/validators';
import { Document, SchemaTypes } from 'mongoose';
import { Property } from 'src/modules/properties/schemas/property.schema';

@Schema({ timestamps: true })
export class Website extends Document {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: [Validators.url, 'Invalid url'],
  })
  url: string;
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: () => Property.name,
  })
  property: string;
}

export const WebsiteSchema = SchemaFactory.createForClass(Website);

WebsiteSchema.index({ name: 1, url: 1 }, { unique: true });
