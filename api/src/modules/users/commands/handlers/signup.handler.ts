import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { SignupCommand } from '../impl/signup.command';
import { UserRepository } from '../../repository/user.repository';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@CommandHandler(SignupCommand)
export class SignupHandler implements ICommandHandler<SignupCommand> {
  constructor(
    private readonly usersRepo: UserRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SignupCommand): Promise<void> {
    const { userDto } = command;
    if (!userDto.password) {
      throw new BadRequestException(`Missing password`);
    }
    const existingUser = await this.usersRepo.findUser({
      email: userDto.email,
    });
    if (existingUser) {
      throw new BadRequestException(
        `User with email ${userDto.email} already exists`,
      );
    }
    const salt = await bcrypt.genSalt();
    userDto.password = await bcrypt.hash(userDto.password, salt);
    const newUser = await this.usersRepo.save(userDto);
    const user = this.publisher.mergeObjectContext(newUser);
    user.userCreated();
    user.commit();
  }
}
