import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../impl/delete-user.command';
import { UserRepository } from '../../repository/user.repository';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { email } = command;
    await this.userRepo.deleteUser({ email });
  }
}
