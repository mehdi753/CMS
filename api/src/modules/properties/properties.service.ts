import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddPropertyDto } from './dto/add-property.dto';
import { AddPropertyCommand } from './commands/impl/add-property.command';
import { GetPropertiesQuery } from './queries/impl/get-properties.query';
import { SubscribeUserCommand } from './commands/impl/subscribe-user.command';
import { SubscribeDto } from './dto/subscribe.dto';
import { Property } from './schemas/property.schema';
import { PropertyQueryFilters } from 'src/@types/filters';
import { DeletePropertyCommand } from './commands/impl/delete-property.command';
import { PaginatedQuery, PaginatedResults } from 'src/@types/misc';
import { EditPropertyDto } from './dto/edit-property.dto';
import { EditPropertyCommand } from './commands/impl/edit-property.command';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async addProperty(property: AddPropertyDto): Promise<Property> {
    return await this.commandBus.execute(new AddPropertyCommand(property));
  }

  async getProperties(
    filters: PaginatedQuery<PropertyQueryFilters>,
  ): Promise<PaginatedResults<Property>> {
    return await this.queryBus.execute(new GetPropertiesQuery(filters));
  }

  async subscribeUser(data: SubscribeDto): Promise<void> {
    return await this.commandBus.execute(new SubscribeUserCommand(data));
  }

  async deleteProperty(id: string): Promise<void> {
    return await this.commandBus.execute(new DeletePropertyCommand(id));
  }

  async updatePropertyDto(property: EditPropertyDto) {
    return await this.commandBus.execute(new EditPropertyCommand(property));
  }
}
