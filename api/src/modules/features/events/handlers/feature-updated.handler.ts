import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FeatureUpdatedEvent } from '../impl/feature-updated.event';

@EventsHandler(FeatureUpdatedEvent)
export class FeatureUpdatedHandler
  implements IEventHandler<FeatureUpdatedEvent>
{
  async handle(event: FeatureUpdatedEvent): Promise<void> {
    //handle event
  }
}
