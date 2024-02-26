import { IQuery } from '@nestjs/cqrs';
import { WebsiteQueryFilters } from 'src/@types/filters';
import { PaginatedQuery } from 'src/@types/misc';

export class GetWebsitesQuery implements IQuery {
  constructor(public readonly filters: PaginatedQuery<WebsiteQueryFilters>) {}
}
