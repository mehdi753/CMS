import { IEvent } from '@nestjs/cqrs';

export class DeleteWebsiteEvent implements IEvent {
  constructor(public readonly property: string) {}
}
