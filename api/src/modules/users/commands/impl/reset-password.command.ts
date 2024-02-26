import { ICommand } from '@nestjs/cqrs';
import { ResetPasswordDto } from '../../dto/reset-password.dto';

export class ResetPasswordCommand implements ICommand {
  constructor(public readonly userDto: ResetPasswordDto) {}
}
