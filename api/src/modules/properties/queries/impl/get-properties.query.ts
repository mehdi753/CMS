import { IQuery } from '@nestjs/cqrs';
import { PropertyQueryFilters } from 'src/@types/filters';
import { PaginatedQuery } from 'src/@types/misc';

export class GetPropertiesQuery implements IQuery {
  constructor(public readonly filters?: PaginatedQuery<PropertyQueryFilters>) {}
}
