import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateWebsiteCommand } from '../impl/create-website.command';
import { Website } from '../../schemas/website.schema';
import { WebsiteRepository } from '../../repository/website.repository';

@CommandHandler(CreateWebsiteCommand)
export class CreateWebsiteHandler
  implements ICommandHandler<CreateWebsiteCommand>
{
  constructor(
    private readonly websiteRepo: WebsiteRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateWebsiteCommand): Promise<Website> {
    const { websiteDto } = command;
    const websiteRoot = await this.websiteRepo.save(websiteDto);
    const websitePublisher = this.publisher.mergeObjectContext(websiteRoot);
    websitePublisher.createHomePage();
    websitePublisher.commit();
    return websiteRoot.website;
  }
}
