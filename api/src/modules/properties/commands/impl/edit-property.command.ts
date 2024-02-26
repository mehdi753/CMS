import { ICommand } from '@nestjs/cqrs';
import { EditPropertyDto } from '../../dto/edit-property.dto';

export class EditPropertyCommand implements ICommand {
  constructor(public readonly property: EditPropertyDto) {}
}
