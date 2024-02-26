import { ICommand } from '@nestjs/cqrs';
import { SubscribeDto } from '../../dto/subscribe.dto';

export class SubscribeUserCommand implements ICommand {
  constructor(public readonly subscribeDto: SubscribeDto) {}
}
