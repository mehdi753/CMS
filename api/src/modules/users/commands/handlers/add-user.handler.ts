import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddUserCommand } from '../impl/add-user.command';
import { UserRepository } from '../../repository/user.repository';
import { BadRequestException } from '@nestjs/common';
import { User } from '../../schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@CommandHandler(AddUserCommand)
export class AddUserHandler implements ICommandHandler<AddUserCommand> {
  constructor(
    private readonly usersRepo: UserRepository,
    private readonly publisher: EventPublisher,
    private readonly config: ConfigService,
  ) {}

  async execute(command: AddUserCommand): Promise<User> {
    const { userDto } = command;
    const existingUser = await this.usersRepo.findUser({
      email: userDto.email,
    });
    if (existingUser) {
      throw new BadRequestException(
        `User with email ${userDto.email} already exists`,
      );
    }
    userDto.password = '';
    if (!userDto.picture) {
      userDto.picture = `${this.config.get('URL')}/storage/avatar.png`;
    }
    const newUser = await this.usersRepo.save(userDto);
    const user = this.publisher.mergeObjectContext(newUser);
    user.recoverUser();
    user.userCreated();
    user.commit();
    return user.user;
  }
}
