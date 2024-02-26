import { ICommand } from '@nestjs/cqrs';
import { RecoverUserDto } from '../../dto/recover-user.dto';

export class RecoverUserCommand implements ICommand {
  constructor(public readonly userDto: RecoverUserDto) {}
}
