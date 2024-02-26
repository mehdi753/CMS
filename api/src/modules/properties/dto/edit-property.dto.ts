import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LocationDto } from './location.dto';

export class EditPropertyDto {
  @IsNotEmpty()
  @IsString()
  readonly _id: string;

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
}
