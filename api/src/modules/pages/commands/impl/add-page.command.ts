import { ICommand } from '@nestjs/cqrs';
import { AddPageDto } from '../../dto/add-page.dto';

export class AddPageCommand implements ICommand {
  constructor(public readonly pageDto: AddPageDto) {}
}
