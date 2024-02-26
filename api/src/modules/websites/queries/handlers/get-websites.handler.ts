import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetWebsitesQuery } from '../impl/get-websites.query';
import { WebsiteRepository } from '../../repository/website.repository';
import { Website } from '../../schemas/website.schema';
import { PaginatedResults } from 'src/@types/misc';

@QueryHandler(GetWebsitesQuery)
export class GetWebsitesHandler implements IQueryHandler<GetWebsitesQuery> {
  constructor(private readonly websiteRepo: WebsiteRepository) {}

  async execute(query: GetWebsitesQuery): Promise<PaginatedResults<Website>> {
    const { filters } = query;
    const { websites, totals } = await this.websiteRepo.find(filters);
    const { limit, offset } = filters;
    return {
      limit,
      offset,
      list: websites,
      total: Math.ceil((totals[0]?.total || 0) / limit),
    };
  }
}
