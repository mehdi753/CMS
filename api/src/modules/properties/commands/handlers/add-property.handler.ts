import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddPropertyCommand } from '../impl/add-property.command';
import { PropertyRepository } from '../../repository/property.repository';
import { BadRequestException } from '@nestjs/common';
import { Property } from '../../schemas/property.schema';
import { Property as IProperty } from '../../interfaces/property.interface';
import { WebsitesService } from 'src/modules/websites/websites.service';
import { getGeoCoding } from 'src/services/google';

@CommandHandler(AddPropertyCommand)
export class AddPropertyHandler implements ICommandHandler<AddPropertyCommand> {
  constructor(
    private readonly propertyRepo: PropertyRepository,
    private readonly websiteService: WebsitesService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AddPropertyCommand): Promise<Property> {
    const { propertyDto } = command;
    const existingProperty = await this.propertyRepo.findProperty({
      name: propertyDto.name,
    });
    if (existingProperty) {
      throw new BadRequestException(
        `Property with name ${propertyDto.name} already exists`,
      );
    }
    const existingWebsite = await this.websiteService.findWebsite({
      url: propertyDto.websiteUrl,
    });
    if (existingWebsite) {
      throw new BadRequestException(
        `Website with url ${propertyDto.websiteUrl} already exists`,
      );
    }
    const geoCoding = await getGeoCoding(
      propertyDto.location.longitude,
      propertyDto.location.latitude,
    );
    const newProperty: Partial<IProperty> = {
      ...propertyDto,
      location: {
        ...propertyDto.location,
        ...geoCoding,
      },
    };
    const propertyRoot = await this.propertyRepo.save(newProperty);
    const propertyPublisher = this.publisher.mergeObjectContext(propertyRoot);
    const property = propertyRoot.property;
    propertyPublisher.createWebsite({
      name: propertyDto.websiteName,
      url: propertyDto.websiteUrl,
    });
    propertyPublisher.commit();
    return property;
  }
}
