import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeletePageFeaturesEvent } from '../impl/delete-page-features.event';
import { FeaturesService } from 'src/modules/features/features.service';

@EventsHandler(DeletePageFeaturesEvent)
export class DeletePageFeaturesHandler
  implements IEventHandler<DeletePageFeaturesEvent>
{
  constructor(private readonly featuresService: FeaturesService) {}

  async handle(event: DeletePageFeaturesEvent): Promise<void> {
    const { page } = event;
    await this.featuresService.deletePageFeatures(page);
  }
}
