import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserSubscribedEvent } from '../impl/user-subscribed.event';
import { UsersService } from 'src/modules/users/users.service';

@EventsHandler(UserSubscribedEvent)
export class UserSubscribedHandler
  implements IEventHandler<UserSubscribedEvent>
{
  constructor(private readonly usersService: UsersService) {}

  async handle(event: UserSubscribedEvent): Promise<void> {
    const { subscribeDto } = event;
    await this.usersService.subscribeToProperty(subscribeDto);
  }
}
