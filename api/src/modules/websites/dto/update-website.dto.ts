import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AddOrUpdatePageDto } from 'src/modules/pages/dto/add-or-update-page.dto';

export class UpdateWebsiteDto {
  @IsOptional()
  @IsString()
  readonly _id: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly url: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => Array<AddOrUpdatePageDto>)
  readonly pages: AddOrUpdatePageDto[];
}
