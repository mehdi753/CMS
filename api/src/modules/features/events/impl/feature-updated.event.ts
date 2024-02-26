import { IEvent } from '@nestjs/cqrs';
import { FEATURE } from 'src/@types/features';
import { BaseContentDto } from '../../dto/add-or-update-feature.dto';

export class FeatureUpdatedEvent implements IEvent {
  constructor(
    public readonly feature: string,
    public readonly name: FEATURE,
    public readonly data?: BaseContentDto,
    public readonly d?: boolean,
  ) {}
}
