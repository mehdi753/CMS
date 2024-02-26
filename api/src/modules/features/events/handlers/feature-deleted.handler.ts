import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FeatureDeletedEvent } from '../impl/feature-deleted.event';

@EventsHandler(FeatureDeletedEvent)
export class FeatureDeletedHandler
  implements IEventHandler<FeatureDeletedEvent>
{
  async handle(event: FeatureDeletedEvent): Promise<void> {
    //handle event
  }
}
