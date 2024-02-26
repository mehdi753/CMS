import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetWebsitePagesQuery } from '../impl/get-website-pages.query';
import { WebsiteRepository } from '../../repository/website.repository';

@QueryHandler(GetWebsitePagesQuery)
export class GetWebsitePagesHandler
  implements IQueryHandler<GetWebsitePagesQuery>
{
  constructor(private readonly websiteRepository: WebsiteRepository) {}

  async execute(query: GetWebsitePagesQuery): Promise<string[]> {
    const { website } = query;
    const pages = await this.websiteRepository.getWebsitePages({
      url: website,
    });
    return pages?.sort((a, b) => a.index - b.index).map((p) => p.name) || [];
  }
}
