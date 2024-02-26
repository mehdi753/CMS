import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateHomePageEvent } from '../impl/create-home-page.event';
import { PagesService } from 'src/modules/pages/pages.service';

@EventsHandler(CreateHomePageEvent)
export class CreateHomePageHandler
  implements IEventHandler<CreateHomePageEvent>
{
  constructor(private readonly pagesService: PagesService) {}

  async handle(event: CreateHomePageEvent): Promise<void> {
    const { website } = event;
    await this.pagesService.createHomePage(website);
  }
}
