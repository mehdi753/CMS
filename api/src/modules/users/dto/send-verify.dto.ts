import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendVerifyDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
