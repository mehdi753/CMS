import { ICommand } from '@nestjs/cqrs';
import { CreateWebsiteDto } from '../../dto/create-website.dto';

export class CreateWebsiteCommand implements ICommand {
  constructor(public readonly websiteDto: CreateWebsiteDto) {}
}
