import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { getPageContentQuery } from '../impl/get-page-content.query';
import { PageRepository } from '../../repository/page.repository';
import { FormattedPage } from '../../interfaces/formatted-page.interface';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(getPageContentQuery)
export class getPageContentHandler
  implements IQueryHandler<getPageContentQuery>
{
  constructor(private readonly pageRepository: PageRepository) {}

  async execute(query: getPageContentQuery): Promise<FormattedPage> {
    const { website, name, language } = query;
    const property = await this.pageRepository.getProperty({ website, name });
    if (property) {
      return await this.pageRepository.getPageContent(
        { website, name },
        language,
      );
    }
    throw new NotFoundException();
  }
}
