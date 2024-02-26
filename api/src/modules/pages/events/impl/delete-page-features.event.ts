import { IEvent } from '@nestjs/cqrs';

export class DeletePageFeaturesEvent implements IEvent {
  constructor(public readonly page: string) {}
}
