import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateWebsiteEvent } from '../impl/create-website.event';
import { WebsitesService } from 'src/modules/websites/websites.service';

@EventsHandler(CreateWebsiteEvent)
export class CreateWebsiteHandler implements IEventHandler<CreateWebsiteEvent> {
  constructor(private readonly websiteService: WebsitesService) {}

  async handle(event: CreateWebsiteEvent): Promise<void> {
    const { website } = event;
    await this.websiteService.createWebsite(website);
  }
}
