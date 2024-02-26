import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscribeCommand } from '../impl/subscribe.command';
import { UserRepository } from '../../repository/user.repository';

@CommandHandler(SubscribeCommand)
export class SubscribeHandler implements ICommandHandler<SubscribeCommand> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: SubscribeCommand): Promise<void> {
    const { subscribeDto } = command;
    const { email, propertyId } = subscribeDto;
    if (subscribeDto.subscribe) {
      await this.userRepo.subscribe(email, propertyId);
    } else {
      await this.userRepo.unsubscribe(email, propertyId);
    }
  }
}
