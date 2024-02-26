import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateWebsiteDto {
  @IsNotEmpty()
  @IsString()
  readonly property: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsUrl()
  readonly url: string;
}
