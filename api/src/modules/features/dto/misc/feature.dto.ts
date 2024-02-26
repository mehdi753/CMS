import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FEATURE } from 'src/@types/features';

export class FeatureDto<T extends FEATURE> {
  @IsOptional()
  @IsString()
  readonly _id?: string;

  @IsNotEmpty()
  @IsEnum(FEATURE)
  readonly name: T;

  @IsOptional()
  @IsString()
  readonly page?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly index: number;
}
