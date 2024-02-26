import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { LocationDto } from './location.dto';

export class AddPropertyDto {
  @IsOptional()
  @IsString()
  readonly picture?: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @Type(() => LocationDto)
  readonly location: LocationDto;

  @IsNotEmpty()
  @IsBoolean()
  readonly active: boolean = true;

  @IsNotEmpty()
  @IsString()
  readonly websiteName: string;

  @IsNotEmpty()
  @IsUrl()
  readonly websiteUrl?: string;
}
