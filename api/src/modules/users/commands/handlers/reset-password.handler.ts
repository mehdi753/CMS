import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../repository/user.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordCommand } from '../impl/reset-password.command';
import { Cache as CacheManager } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly usersRepo: UserRepository,
    private readonly publisher: EventPublisher,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const { userDto } = command;
    const _id = await this.cacheManager.get<string>(
      `recover_user_token_${userDto.token}`,
    );
    if (!_id) {
      throw new NotFoundException(`Couldn't find user`);
    }
    const salt = await bcrypt.genSalt();
    const password: string = await bcrypt.hash<string>(userDto.password, salt);
    const updatedUser = await this.usersRepo.updateUser({ _id }, { password });
    updatedUser.token = userDto.token;
    const user = this.publisher.mergeObjectContext(updatedUser);
    user.passwordReset();
    user.commit();
  }
}
