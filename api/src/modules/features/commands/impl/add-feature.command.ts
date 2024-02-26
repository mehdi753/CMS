import { ICommand } from '@nestjs/cqrs';
import { AddOrUpdateFeatureDto } from '../../dto/add-or-update-feature.dto';

export class AddFeatureCommand implements ICommand {
  constructor(public readonly featureDto: AddOrUpdateFeatureDto) {}
}
