import { AggregateRoot } from '@nestjs/cqrs';
import { Website } from '../schemas/website.schema';
import { CreateHomePageEvent } from '../events/impl/create-home-page.event';
import { DeletePagesEvent } from '../events/impl/delete-pages.event';
import { UpdateWebsitePagesEvent } from '../events/impl/update-website-pages.event';
import { AddOrUpdatePageDto } from 'src/modules/pages/dto/add-or-update-page.dto';

export class WebsiteRoot extends AggregateRoot {
  private _website: Website;

  constructor(private readonly id?: string) {
    super();
  }

  public set website(website: Website) {
    this._website = website;
  }

  public get website(): Website {
    return this._website;
  }

  public createHomePage(): void {
    return this.apply(new CreateHomePageEvent(this.id));
  }

  public deletePages(): void {
    return this.apply(new DeletePagesEvent(this.id));
  }

  public updatePages(pages: AddOrUpdatePageDto[]): void {
    return this.apply(new UpdateWebsitePagesEvent(this.id, pages));
  }
}
