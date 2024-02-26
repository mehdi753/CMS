import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginatedQuery } from 'src/@types/misc';
import { PropertyQueryFilters } from 'src/@types/filters';

export class GetPropertiesDto implements PaginatedQuery<PropertyQueryFilters> {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  offset: number;

  @IsOptional()
  query: Partial<PropertyQueryFilters>;
}
