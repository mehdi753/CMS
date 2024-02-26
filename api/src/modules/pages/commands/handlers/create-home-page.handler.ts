import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateHomePageCommand } from '../impl/create-home-page.command';
import { PageRepository } from '../../repository/page.repository';
import { AddPageDto } from '../../dto/add-page.dto';
import { Page } from '../../schemas/page.schema';

@CommandHandler(CreateHomePageCommand)
export class CreateHomePageHandler
  implements ICommandHandler<CreateHomePageCommand>
{
  constructor(
    private readonly pageRepo: PageRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateHomePageCommand): Promise<Page> {
    const { website } = command;
    const page: AddPageDto = {
      name: 'Home',
      website,
    };
    const pageRoot = await this.pageRepo.save(page);
    const pagePublisher = this.publisher.mergeObjectContext(pageRoot);
    pagePublisher.initHomePageFeatures();
    pagePublisher.commit();
    return pagePublisher.page;
  }
}
