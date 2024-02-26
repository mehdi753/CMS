import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../impl/user-created.event';
import CustomLogger from 'src/utils/custom-logger';
import { Cache as CacheManager } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { uid } from 'uid';
import { Inject } from '@nestjs/common';

const Logger = new CustomLogger('USER-CREATED-EVENT');

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}
  async handle(event: UserCreatedEvent): Promise<void> {
    Logger.debug(JSON.stringify(event));
    const token = uid(16);
    await this.cacheManager
      .set(`verify_user_token_${token}`, event.userId)
      .then(() => {
        event.setUserToken(token);
      });
  }
}
