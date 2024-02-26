import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdatePageFeaturesEvent } from '../impl/update-page-features.event';
import { FeaturesService } from 'src/modules/features/features.service';

@EventsHandler(UpdatePageFeaturesEvent)
export class UpdatePageFeaturesHandler
  implements IEventHandler<UpdatePageFeaturesEvent>
{
  constructor(private readonly featuresService: FeaturesService) {}

  async handle(event: UpdatePageFeaturesEvent): Promise<void> {
    const { page, features } = event;
    await this.featuresService.updatePageFeatures(page, features);
  }
}
