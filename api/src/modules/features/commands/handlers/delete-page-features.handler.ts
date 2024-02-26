import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeletePageFeaturesCommand } from '../impl/delete-page-features.command';
import { FeatureRepository } from '../../repository/feature.repository';

@CommandHandler(DeletePageFeaturesCommand)
export class DeletePageFeaturesHandler
  implements ICommandHandler<DeletePageFeaturesCommand>
{
  constructor(
    private readonly featureRepo: FeatureRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeletePageFeaturesCommand): Promise<void> {
    const { page } = command;
    const featuresRoots = await this.featureRepo.deletePageFeatures(page);
    if (featuresRoots?.length) {
      featuresRoots.forEach((f) => {
        const featurePublisher = this.publisher.mergeObjectContext(f);
        featurePublisher.featureDeleted();
        featurePublisher.commit();
      });
    }
  }
}
