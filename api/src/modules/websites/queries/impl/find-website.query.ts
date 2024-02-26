import { IQuery } from '@nestjs/cqrs';
import { WebsiteQueryFilters } from 'src/@types/filters';

export class FindWebsiteQuery implements IQuery {
  constructor(public readonly filters: Partial<WebsiteQueryFilters>) {}
}
