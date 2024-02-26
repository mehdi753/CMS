import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Gallery {
  @Prop([String])
  images: string[];
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
