import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FeatureCreatedEvent } from '../impl/feature-created.event';

@EventsHandler(FeatureCreatedEvent)
export class FeatureCreatedHandler
  implements IEventHandler<FeatureCreatedEvent>
{
  async handle(event: FeatureCreatedEvent): Promise<void> {
    //handle event
  }
}
