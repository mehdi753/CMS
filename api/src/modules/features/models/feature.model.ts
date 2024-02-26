import { AggregateRoot } from '@nestjs/cqrs';
import { Feature } from '../schemas/feature.schema';
import { FeatureCreatedEvent } from '../events/impl/feature-created.event';
import { FeatureDeletedEvent } from '../events/impl/feature-deleted.event';
import { FeatureUpdatedEvent } from '../events/impl/feature-updated.event';
import { BaseContentDto } from '../dto/add-or-update-feature.dto';

export class FeatureRoot extends AggregateRoot {
  private _feature: Feature;

  constructor(private readonly id?: string) {
    super();
  }

  public set feature(feature: Feature) {
    this._feature = feature;
  }

  public get feature(): Feature {
    return this._feature;
  }

  public featureCreated() {
    return this.apply(new FeatureCreatedEvent(this.id, this._feature.name));
  }

  public featureDeleted() {
    return this.apply(new FeatureDeletedEvent(this.id, this._feature.name));
  }

  public featureUpdated(content?: BaseContentDto, d?: boolean) {
    return this.apply(
      new FeatureUpdatedEvent(this.id, this._feature.name, content, d),
    );
  }
}
