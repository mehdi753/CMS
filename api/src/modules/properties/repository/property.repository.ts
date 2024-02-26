import { InjectModel } from '@nestjs/mongoose';
import { Property } from '../schemas/property.schema';
import { Model } from 'mongoose';
import { Property as IProperty } from '../interfaces/property.interface';
import { PropertyRoot } from '../models/property.model';
import { NotFoundException } from '@nestjs/common';
import { PropertyQueryFilters } from 'src/@types/filters';
import { QueriesConstructor } from './query.constructors';
import { PaginatedQuery } from 'src/@types/misc';
import { User } from 'src/modules/users/schemas/user.schema';

export class PropertyRepository extends QueriesConstructor {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<Property>,
  ) {
    super();
  }

  async findProperty(
    property: Partial<PropertyQueryFilters>,
  ): Promise<PropertyRoot> {
    const foundProperty = await this.propertyModel.findOne(property);
    if (foundProperty) {
      const propertyRoot = new PropertyRoot(foundProperty._id);
      propertyRoot.property = foundProperty;
      return propertyRoot;
    }
    return null;
  }

  async save(property: Partial<IProperty>): Promise<PropertyRoot> {
    const newProperty = new this.propertyModel(property);
    const savedProperty = await newProperty.save();
    const propertyRoot = new PropertyRoot(savedProperty._id);
    propertyRoot.property = savedProperty;
    return propertyRoot;
  }

  async find(filters?: PaginatedQuery<PropertyQueryFilters>) {
    const $match = this.filters(filters.query);

    return await this.propertyModel.aggregate([
      {
        $match,
      },
      {
        $facet: {
          total: [{ $count: 'total' }],
          data: [
            {
              $skip: (filters.offset - 1) * filters.limit,
            },
            {
              $limit: filters.limit,
            },
            {
              $lookup: {
                from: 'users',
                localField: 'users',
                foreignField: '_id',
                as: 'users',
              },
            },
            {
              $lookup: {
                from: 'websites',
                localField: 'website',
                foreignField: '_id',
                as: 'website',
              },
            },
          ],
        },
      },
    ]);
  }

  async addUser(propertyId: string, userId: string): Promise<PropertyRoot> {
    const update = await this.propertyModel.updateOne(
      { _id: propertyId },
      { $push: { users: userId } },
    );

    if (!update.matchedCount) {
      throw new NotFoundException(`Couldn't find property`);
    }

    return await this.findProperty({ _id: propertyId });
  }

  async removeUser(propertyId: string, userId: string): Promise<PropertyRoot> {
    const update = await this.propertyModel.updateOne(
      { _id: propertyId },
      { $pull: { users: userId } },
    );

    if (!update.matchedCount) {
      throw new NotFoundException(`Couldn't find property`);
    }
    return await this.findProperty({ _id: propertyId });
  }

  async delete(propertyId: string): Promise<PropertyRoot> {
    const res = await this.propertyModel.findByIdAndDelete(propertyId);
    if (res) {
      return new PropertyRoot(propertyId);
    }
    return null;
  }

  async update(
    filters: Partial<PropertyQueryFilters>,
    property: Partial<IProperty>,
  ): Promise<PropertyRoot> {
    const updatedResult = await this.propertyModel.updateOne(filters, {
      $set: property,
    });
    if (!updatedResult.matchedCount) {
      throw new NotFoundException(`Couldn't find user`);
    }
    return await this.findProperty(filters);
  }

  async assignees(filters?: PaginatedQuery<PropertyQueryFilters>) {
    const $match = this.filters(filters.query);
    return await this.propertyModel.aggregate([
      {
        $match,
      },
      {
        $lookup: {
          from: User.name,
          localField: 'users',
          foreignField: '_id',
          as: 'users',
          pipeline: [
            {
              $facet: {
                total: [{ $count: 'total' }],
                data: [
                  {
                    $skip: (filters.offset - 1) * filters.limit,
                  },
                  {
                    $limit: filters.limit,
                  },
                  {
                    $project: {
                      password: 0,
                      updatedAt: 0,
                      __v: 0,
                      createdAt: 0,
                      properties: 0,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);
  }
}
