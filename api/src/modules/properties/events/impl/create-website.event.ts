import { IEvent } from '@nestjs/cqrs';
import { CreateWebsiteDto } from 'src/modules/websites/dto/create-website.dto';

export class CreateWebsiteEvent implements IEvent {
  constructor(public readonly website: CreateWebsiteDto) {}
}
