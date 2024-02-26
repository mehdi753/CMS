import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import CustomLogger from 'src/utils/custom-logger';
import { Inject, Injectable } from '@nestjs/common';
import { Cache as CacheManager } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PasswordResetEvent } from '../impl/password-reset.event';

const Logger = new CustomLogger('PASSWORD-RESET-EVENT');

@Injectable()
@EventsHandler(PasswordResetEvent)
export class PasswordResetHandler implements IEventHandler<PasswordResetEvent> {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}
  async handle(event: PasswordResetEvent): Promise<void> {
    Logger.debug(JSON.stringify(event));
    await this.cacheManager.del(`recover_user_token_${event.token}`);
  }
}
