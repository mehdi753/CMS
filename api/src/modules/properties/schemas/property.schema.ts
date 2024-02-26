import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Location } from './location.schema';

@Schema({ timestamps: true })
export class Property extends Document {
  @Prop({ type: String, required: false, default: null })
  picture?: string;
  @Prop({ type: Boolean, required: true, unique: false, default: true })
  active: boolean;
  @Prop({ type: String, required: true, unique: true })
  name: string;
  @Prop({ type: Location, required: true, unique: false })
  location: Location;
  @Prop([
    {
      type: SchemaTypes.ObjectId,
      required: true,
      index: true,
      ref: () => User.name,
      default: [],
    },
  ])
  users: string[];
}

export const PropertySchema = SchemaFactory.createForClass(Property);
