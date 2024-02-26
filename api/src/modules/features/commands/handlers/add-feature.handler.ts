import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddFeatureCommand } from '../impl/add-feature.command';
import { FeatureRepository } from '../../repository/feature.repository';
import { Feature } from '../../schemas/feature.schema';

@CommandHandler(AddFeatureCommand)
export class AddFeatureHandler implements ICommandHandler<AddFeatureCommand> {
  constructor(
    private readonly featureRepo: FeatureRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AddFeatureCommand): Promise<Feature> {
    const { featureDto } = command;
    const featureRoot = await this.featureRepo.save(featureDto);
    const featurePublisher = this.publisher.mergeObjectContext(featureRoot);
    featurePublisher.featureCreated();
    featurePublisher.commit();
    return featurePublisher.feature;
  }
}
