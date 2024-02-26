import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export class GalleryDto {
  @IsNotEmpty()
  @IsArray()
  @Type(() => Array<string>)
  readonly images: string[];
}
