import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import CustomLogger from 'src/utils/custom-logger';
import { Inject, Injectable } from '@nestjs/common';
import { Cache as CacheManager } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserVerifiedEvent } from '../impl/user-verified.event';

const Logger = new CustomLogger('USER-VERIFIED-EVENT');

@Injectable()
@EventsHandler(UserVerifiedEvent)
export class UserVerifiedHandler implements IEventHandler<UserVerifiedEvent> {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}
  async handle(event: UserVerifiedEvent): Promise<void> {
    Logger.debug(JSON.stringify(event));
    await this.cacheManager.del(`verify_user_token_${event.token}`);
  }
}
