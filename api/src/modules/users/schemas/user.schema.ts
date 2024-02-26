import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ROLE } from 'src/@types/roles';
import { Property } from 'src/modules/properties/schemas/property.schema';
import { Validators } from 'src/utils/validators';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    type: String,
    required: false,
    default: `${process.env.URL}/storage/avatar.png`,
  })
  picture: string;
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: [Validators.email, 'Invalid email'],
  })
  email: string;
  @Prop({ type: String })
  password: string;
  @Prop({ type: String, required: true, enum: ROLE, default: ROLE.AGENT })
  role: ROLE;
  @Prop({ type: Boolean, required: true, default: false })
  verified: boolean;
  @Prop([
    {
      type: SchemaTypes.ObjectId,
      required: true,
      index: true,
      ref: () => Property.name,
      default: [],
    },
  ])
  properties: string[];
}

export const UsersSchema = SchemaFactory.createForClass(User);
