import { IEvent } from '@nestjs/cqrs';
import { SubscribeDto } from '../../dto/subscribe.dto';

export class UserSubscribedEvent implements IEvent {
  constructor(public readonly subscribeDto: SubscribeDto) {}
}
