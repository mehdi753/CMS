import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeletePagesEvent } from '../impl/delete-pages.event';
import { PagesService } from 'src/modules/pages/pages.service';

@EventsHandler(DeletePagesEvent)
export class DeletePagesHandler implements IEventHandler<DeletePagesEvent> {
  constructor(private readonly pagesService: PagesService) {}

  async handle(event: DeletePagesEvent): Promise<void> {
    const { website } = event;
    await this.pagesService.deletePagesByWebsite(website);
  }
}
