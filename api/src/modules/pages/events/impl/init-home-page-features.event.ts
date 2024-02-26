import { IEvent } from '@nestjs/cqrs';

export class InitHomePageFeaturesEvent implements IEvent {
  constructor(public readonly page: string) {}
}
