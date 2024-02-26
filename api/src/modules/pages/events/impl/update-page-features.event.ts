import { IEvent } from '@nestjs/cqrs';
import { AddOrUpdateFeatureDto } from 'src/modules/features/dto/add-or-update-feature.dto';

export class UpdatePageFeaturesEvent implements IEvent {
  constructor(
    public readonly page: string,
    public readonly features: AddOrUpdateFeatureDto[],
  ) {}
}
