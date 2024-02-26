import { ICommand } from '@nestjs/cqrs';
import { SubscribeDto } from 'src/modules/properties/dto/subscribe.dto';

export class SubscribeCommand implements ICommand {
  constructor(public readonly subscribeDto: SubscribeDto) {}
}
