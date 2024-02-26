import { ICommand } from '@nestjs/cqrs';
import { SendVerifyDto } from '../../dto/send-verify.dto';

export class SendVerifyCommand implements ICommand {
  constructor(public readonly userDto: SendVerifyDto) {}
}
