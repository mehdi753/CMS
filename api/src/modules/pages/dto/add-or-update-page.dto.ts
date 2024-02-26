import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AddOrUpdateFeatureDto } from 'src/modules/features/dto/add-or-update-feature.dto';

export class AddOrUpdatePageDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  index: number;

  @IsNotEmpty()
  @IsString()
  website: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => Array<AddOrUpdateFeatureDto>)
  features: AddOrUpdateFeatureDto[];
}
