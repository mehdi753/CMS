import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { I18nText } from 'src/@types/language';

export class ContentDto {
  @IsNotEmpty()
  readonly title: I18nText;

  @IsNotEmpty()
  readonly description: I18nText;

  @IsOptional()
  @IsArray()
  @Type(() => Array<string>)
  readonly images?: string[];
}
