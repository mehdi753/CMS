import { ICommand } from '@nestjs/cqrs';
import { UpdateUserDto } from '../../dto/update-user.dto';

export class UpdateUserCommand implements ICommand {
  constructor(public readonly userDto: UpdateUserDto) {}
}
