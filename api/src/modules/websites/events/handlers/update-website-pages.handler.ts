import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PagesService } from 'src/modules/pages/pages.service';
import { UpdateWebsitePagesEvent } from '../impl/update-website-pages.event';

@EventsHandler(UpdateWebsitePagesEvent)
export class UpdateWebsitePagesHandler
  implements IEventHandler<UpdateWebsitePagesEvent>
{
  constructor(private readonly pagesService: PagesService) {}

  async handle(event: UpdateWebsitePagesEvent): Promise<void> {
    const { website, pages } = event;
    await this.pagesService.updateWebsitePages(website, pages);
  }
}
