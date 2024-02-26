import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindWebsiteQuery } from '../impl/find-website.query';
import { WebsiteRepository } from '../../repository/website.repository';
import { Website } from '../../schemas/website.schema';

@QueryHandler(FindWebsiteQuery)
export class FindWebsiteHandler implements IQueryHandler<FindWebsiteQuery> {
  constructor(private readonly websiteRepo: WebsiteRepository) {}

  async execute(query: Partial<FindWebsiteQuery>): Promise<Website> {
    const { filters } = query;
    const websiteRoot = await this.websiteRepo.findWebsite(filters);
    return websiteRoot?.website;
  }
}
