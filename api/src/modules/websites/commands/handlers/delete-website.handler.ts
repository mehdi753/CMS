import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeleteWebsiteCommand } from '../impl/delete-website.command';
import { WebsiteRepository } from '../../repository/website.repository';

@CommandHandler(DeleteWebsiteCommand)
export class DeleteWebsiteHandler
  implements ICommandHandler<DeleteWebsiteCommand>
{
  constructor(
    private readonly websiteRepo: WebsiteRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteWebsiteCommand): Promise<void> {
    const { property } = command;
    const websiteRoot = await this.websiteRepo.deleteWebsiteByPropertyId(
      property,
    );
    if (websiteRoot) {
      const websitePublisher = this.publisher.mergeObjectContext(websiteRoot);
      websitePublisher.deletePages();
      websitePublisher.commit();
    }
  }
}
