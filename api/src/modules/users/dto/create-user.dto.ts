import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
import { ROLE } from 'src/@types/roles';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  picture?: string;

  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @IsNotEmpty()
  @IsEnum(ROLE)
  readonly role: ROLE;
}
