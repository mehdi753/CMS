import { ICommand } from '@nestjs/cqrs';
import { UpdateWebsiteDto } from '../../dto/update-website.dto';

export class UpdateWebsiteCommand implements ICommand {
  constructor(public readonly websiteDto: UpdateWebsiteDto) {}
}
