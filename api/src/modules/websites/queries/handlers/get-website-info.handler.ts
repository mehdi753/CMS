import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetWebsiteInfoQuery } from '../impl/get-website-info.query';
import { WebsiteRepository } from '../../repository/website.repository';
import { Website } from '../../schemas/website.schema';

@QueryHandler(GetWebsiteInfoQuery)
export class GetWebsiteInfoHandler
  implements IQueryHandler<GetWebsiteInfoQuery>
{
  constructor(private readonly websiteRepo: WebsiteRepository) {}

  async execute(query: Partial<GetWebsiteInfoQuery>): Promise<Website> {
    const { filters } = query;
    const websiteRoot = await this.websiteRepo.getWebsiteInfo(filters);
    return websiteRoot?.website;
  }
}
