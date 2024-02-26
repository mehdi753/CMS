import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeleteWebsitePagesCommand } from '../impl/delete-website-pages.command';
import { PageRepository } from '../../repository/page.repository';

@CommandHandler(DeleteWebsitePagesCommand)
export class DeleteWebsitePagesHandler
  implements ICommandHandler<DeleteWebsitePagesCommand>
{
  constructor(
    private readonly pageRepo: PageRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteWebsitePagesCommand): Promise<void> {
    const { website } = command;
    const pagesRoots = await this.pageRepo.deleteWebsitePages(website);
    if (pagesRoots?.length) {
      pagesRoots.forEach((pageRoot) => {
        const pagePublisher = this.publisher.mergeObjectContext(pageRoot);
        pagePublisher.deletePageFeatures();
        pagePublisher.commit();
      });
    }
  }
}
