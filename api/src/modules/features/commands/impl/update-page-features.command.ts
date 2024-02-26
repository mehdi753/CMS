import { ICommand } from '@nestjs/cqrs';
import { AddOrUpdateFeatureDto } from '../../dto/add-or-update-feature.dto';

export class UpdatePageFeaturesCommand implements ICommand {
  constructor(
    public readonly page: string,
    public readonly features: AddOrUpdateFeatureDto[],
  ) {}
}
