import { IEvent } from '@nestjs/cqrs';

export class DeletePagesEvent implements IEvent {
  constructor(public readonly website: string) {}
}
