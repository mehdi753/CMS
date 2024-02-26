import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateWebsiteCommand } from '../impl/update-website.command';
import { Website as IWebsite } from '../../interfaces/website.interface';
import { WebsiteRepository } from '../../repository/website.repository';

@CommandHandler(UpdateWebsiteCommand)
export class UpdateWebsiteHandler
  implements ICommandHandler<UpdateWebsiteCommand>
{
  constructor(
    private readonly websiteRepo: WebsiteRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateWebsiteCommand): Promise<void> {
    const { websiteDto } = command;
    const website: Partial<IWebsite> = {
      name: websiteDto.name,
      url: websiteDto.url,
    };
    const websiteRoot = await this.websiteRepo.update(
      { _id: websiteDto._id },
      website,
    );
    const websitePublisher = this.publisher.mergeObjectContext(websiteRoot);
    websitePublisher.updatePages(websiteDto.pages);
    websitePublisher.commit();
  }
}
