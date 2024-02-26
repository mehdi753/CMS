import { AggregateRoot } from '@nestjs/cqrs';
import { Page } from '../schemas/page.schema';
import { InitHomePageFeaturesEvent } from '../events/impl/init-home-page-features.event';
import { DeletePageFeaturesEvent } from '../events/impl/delete-page-features.event';
import { UpdatePageFeaturesEvent } from '../events/impl/update-page-features.event';
import { AddOrUpdateFeatureDto } from 'src/modules/features/dto/add-or-update-feature.dto';

export class PageRoot extends AggregateRoot {
  private _page: Page;

  constructor(private readonly id?: string) {
    super();
  }

  public set page(page: Page) {
    this._page = page;
  }

  public get page(): Page {
    return this._page;
  }

  public initHomePageFeatures(): void {
    return this.apply(new InitHomePageFeaturesEvent(this.id));
  }

  public deletePageFeatures(): void {
    return this.apply(new DeletePageFeaturesEvent(this.id));
  }

  public updatePageFeatures(features: AddOrUpdateFeatureDto[]): void {
    return this.apply(new UpdatePageFeaturesEvent(this.id, features));
  }
}
