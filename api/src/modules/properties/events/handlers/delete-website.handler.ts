import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteWebsiteEvent } from '../impl/delete-website.event';
import { WebsitesService } from 'src/modules/websites/websites.service';

@EventsHandler(DeleteWebsiteEvent)
export class DeleteWebsiteHandler implements IEventHandler<DeleteWebsiteEvent> {
  constructor(private readonly websiteService: WebsitesService) {}

  async handle(event: DeleteWebsiteEvent): Promise<void> {
    const { property } = event;
    await this.websiteService.deletePropertyWebsite(property);
  }
}
