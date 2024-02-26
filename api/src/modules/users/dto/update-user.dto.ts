import {
  IsString,
  IsEmail,
  IsOptional,
  IsStrongPassword,
  IsEnum,
} from 'class-validator';
import { ROLE } from 'src/@types/roles';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly picture?: string;

  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @IsOptional()
  @IsEnum(ROLE)
  readonly role?: ROLE;
}
