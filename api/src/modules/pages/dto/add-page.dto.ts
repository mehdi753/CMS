import { IsNotEmpty, IsString } from 'class-validator';

export class AddPageDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly website: string;
}
