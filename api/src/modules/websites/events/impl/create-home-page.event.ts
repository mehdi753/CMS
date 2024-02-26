import { IEvent } from '@nestjs/cqrs';

export class CreateHomePageEvent implements IEvent {
  constructor(public readonly website: string) {}
}
