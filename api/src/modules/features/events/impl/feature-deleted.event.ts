import { IEvent } from '@nestjs/cqrs';
import { FEATURE } from 'src/@types/features';

export class FeatureDeletedEvent implements IEvent {
  constructor(public readonly feature: string, public readonly name: FEATURE) {}
}
