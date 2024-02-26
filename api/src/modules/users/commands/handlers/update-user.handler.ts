import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../impl/update-user.command';
import { UserRepository } from '../../repository/user.repository';
import { User } from '../../schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const { userDto } = command;
    if (userDto.password) {
      const salt = await bcrypt.genSalt();
      userDto.password = await bcrypt.hash(userDto.password, salt);
    }
    const userRoot = await this.userRepo.updateUser(
      { email: userDto.email },
      userDto,
    );
    return userRoot.user;
  }
}
