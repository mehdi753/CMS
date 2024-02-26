import { AggregateRoot } from '@nestjs/cqrs';
import { Property } from '../schemas/property.schema';
import { CreateWebsiteEvent } from '../events/impl/create-website.event';
import { UserSubscribedEvent } from '../events/impl/user-subscribed.event';
import { SubscribeDto } from '../dto/subscribe.dto';
import { DeleteWebsiteEvent } from '../events/impl/delete-website.event';

export class PropertyRoot extends AggregateRoot {
  private _property: Property;

  constructor(private readonly id?: string) {
    super();
  }

  public set property(property: Property) {
    this._property = property;
  }

  public get property(): Property {
    return this._property;
  }

  public createWebsite(website: { name: string; url: string }): void {
    return this.apply(
      new CreateWebsiteEvent({ ...website, property: this.id }),
    );
  }

  public userSubscribed(subscribe: SubscribeDto): void {
    return this.apply(new UserSubscribedEvent(subscribe));
  }

  public deleteWebsite(property: string): void {
    return this.apply(new DeleteWebsiteEvent(property));
  }
}
