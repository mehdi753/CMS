import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPropertiesQuery } from '../impl/get-properties.query';
import { PropertyRepository } from '../../repository/property.repository';
import { Property } from '../../schemas/property.schema';
import { PaginatedResults } from 'src/@types/misc';

@QueryHandler(GetPropertiesQuery)
export class GetPropertiesHandler implements IQueryHandler<GetPropertiesQuery> {
  constructor(private readonly propertyRepo: PropertyRepository) {}

  async execute(
    query: GetPropertiesQuery,
  ): Promise<PaginatedResults<Property>> {
    const { filters } = query;
    const properties = await this.propertyRepo.find(filters);
    const { limit, offset } = filters;
    return {
      limit,
      offset,
      list: properties[0].data,
      total: Math.ceil((properties?.[0]?.total?.[0]?.total || 0) / limit),
    };
  }
}
