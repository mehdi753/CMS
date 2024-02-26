import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RecoverUserCommand } from '../impl/recover-user.command';
import { UserRepository } from '../../repository/user.repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(RecoverUserCommand)
export class RecoverUserHandler implements ICommandHandler<RecoverUserCommand> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RecoverUserCommand): Promise<void> {
    const { userDto } = command;
    const user = await this.userRepo.findUser(userDto);
    if (!user) {
      throw new NotFoundException(
        `Couldn't find user with email ${userDto.email}`,
      );
    }
    const userRoot = this.publisher.mergeObjectContext(user);
    userRoot.recoverUser();
    userRoot.commit();
  }
}
