import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EditPropertyCommand } from '../impl/edit-property.command';
import { PropertyRepository } from '../../repository/property.repository';
import { Property } from '../../schemas/property.schema';
import { Property as IProperty } from '../../schemas/property.schema';
import { getGeoCoding } from 'src/services/google';

@CommandHandler(EditPropertyCommand)
export class EditPropertyHandler
  implements ICommandHandler<EditPropertyCommand>
{
  constructor(private readonly propertyRepo: PropertyRepository) {}

  async execute(command: EditPropertyCommand): Promise<Property> {
    const { property } = command;
    const editedProperty: Partial<IProperty> = {
      ...property,
    };
    if (property.location) {
      const geoCoding = await getGeoCoding(
        property.location.longitude,
        property.location.latitude,
      );
      editedProperty.location = {
        ...property.location,
        ...geoCoding,
      };
    }
    const propertyRoot = await this.propertyRepo.update(
      { _id: property._id },
      editedProperty,
    );
    return propertyRoot.property;
  }
}
