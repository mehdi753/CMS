import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../repository/user.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { Cache as CacheManager } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { VerifyUserCommand } from '../impl/verify-user.command';

@CommandHandler(VerifyUserCommand)
export class VerifyUserHandler implements ICommandHandler<VerifyUserCommand> {
  constructor(
    private readonly usersRepo: UserRepository,
    private readonly publisher: EventPublisher,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}

  async execute(command: VerifyUserCommand): Promise<void> {
    const { token } = command;
    const _id = await this.cacheManager.get<string>(
      `verify_user_token_${token}`,
    );
    if (!_id) {
      throw new NotFoundException(`Couldn't find user`);
    }
    const updatedUser = await this.usersRepo.updateUser(
      { _id },
      { verified: true },
    );
    updatedUser.token = token;
    const user = this.publisher.mergeObjectContext(updatedUser);
    user.userVerified();
    user.commit();
  }
}
