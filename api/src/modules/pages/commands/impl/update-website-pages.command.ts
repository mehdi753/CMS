import { ICommand } from '@nestjs/cqrs';
import { AddOrUpdatePageDto } from '../../dto/add-or-update-page.dto';

export class UpdateWebsitePagesCommand implements ICommand {
  constructor(
    public readonly website: string,
    public readonly pages: AddOrUpdatePageDto[],
  ) {}
}
