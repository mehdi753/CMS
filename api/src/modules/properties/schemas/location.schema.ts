import { Prop } from '@nestjs/mongoose';

export class Location {
  @Prop({ type: Number, required: true })
  longitude: number;
  @Prop({ type: Number, required: true })
  latitude: number;
  @Prop({ type: String, required: false })
  country?: string;
  @Prop({ type: String, required: false })
  locality?: string;
  @Prop({ type: String, required: false })
  state?: string;
  @Prop({ type: String, required: false })
  countryCode?: string;
}
