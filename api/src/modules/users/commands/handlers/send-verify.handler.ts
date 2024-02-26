import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../repository/user.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SendVerifyCommand } from '../impl/send-verify.command';

@CommandHandler(SendVerifyCommand)
export class SendVerifyHandler implements ICommandHandler<SendVerifyCommand> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SendVerifyCommand): Promise<void> {
    const { userDto } = command;
    const user = await this.userRepo.findUser(userDto);
    if (!user) {
      throw new NotFoundException(
        `Couldn't find user with email ${userDto.email}`,
      );
    }
    if (user.user.verified) {
      throw new BadRequestException(
        `User with email ${userDto.email} is already verified`,
      );
    }
    const userRoot = this.publisher.mergeObjectContext(user);
    userRoot.userCreated();
    userRoot.commit();
  }
}
