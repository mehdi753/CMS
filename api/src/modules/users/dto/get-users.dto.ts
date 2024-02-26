import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginatedQuery } from 'src/@types/misc';
import { UserQueryFilters } from 'src/@types/filters';

export class GetUsersDto implements PaginatedQuery<UserQueryFilters> {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  offset: number;

  @IsOptional()
  query: Partial<UserQueryFilters>;
}
