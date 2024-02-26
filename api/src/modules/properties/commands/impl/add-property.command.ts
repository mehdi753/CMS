import { ICommand } from '@nestjs/cqrs';
import { AddPropertyDto } from '../../dto/add-property.dto';

export class AddPropertyCommand implements ICommand {
  constructor(public readonly propertyDto: AddPropertyDto) {}
}
