import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RecoverUserEvent } from '../impl/recover-user.event';
import CustomLogger from 'src/utils/custom-logger';
import { Inject, Injectable } from '@nestjs/common';
import { Cache as CacheManager } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { uid } from 'uid';

const Logger = new CustomLogger('RECOVER-PASSWORD-EVENT');

@Injectable()
@EventsHandler(RecoverUserEvent)
export class RecoverUserHandler implements IEventHandler<RecoverUserEvent> {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}
  async handle(event: RecoverUserEvent): Promise<void> {
    Logger.debug(JSON.stringify(event));
    const token = uid(16);
    await this.cacheManager
      .set(`recover_user_token_${token}`, event.userId, 3600 * 1000)
      .then(() => {
        event.setUserToken(token);
      });
  }
}
