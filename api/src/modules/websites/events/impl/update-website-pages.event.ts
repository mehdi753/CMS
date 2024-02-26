import { IEvent } from '@nestjs/cqrs';
import { AddOrUpdatePageDto } from 'src/modules/pages/dto/add-or-update-page.dto';

export class UpdateWebsitePagesEvent implements IEvent {
  constructor(
    public readonly website: string,
    public readonly pages: AddOrUpdatePageDto[],
  ) {}
}
