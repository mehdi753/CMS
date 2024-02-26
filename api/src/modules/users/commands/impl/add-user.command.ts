import { ICommand } from '@nestjs/cqrs';
import { CreateUserDto } from '../../dto/create-user.dto';

export class AddUserCommand implements ICommand {
  constructor(public readonly userDto: CreateUserDto) {}
}
