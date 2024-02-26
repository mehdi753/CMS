import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateWebsitePagesCommand } from '../impl/update-website-pages.command';
import { PageRepository } from '../../repository/page.repository';
import { Page } from '../../interfaces/page.interface';

@CommandHandler(UpdateWebsitePagesCommand)
export class UpdateWebsitePagesHandler
  implements ICommandHandler<UpdateWebsitePagesCommand>
{
  constructor(
    private readonly pageRepository: PageRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateWebsitePagesCommand): Promise<void> {
    const { website, pages } = command;
    const pagesList: Page[] = pages.map((page) => ({
      name: page.name,
      index: page.index,
      website: website,
    }));
    const pagesRoots = await this.pageRepository.addOrUpdateMultiple(
      pagesList,
      website,
    );
    if (pagesRoots?.length) {
      pagesRoots.forEach((pageRoot) => {
        const pagePublisher = this.publisher.mergeObjectContext(pageRoot);
        const features = pages.find(
          (page) => page.index === pageRoot.page.index,
        ).features;
        pagePublisher.updatePageFeatures(features || []);
        pagePublisher.commit();
      });
    }
  }
}
