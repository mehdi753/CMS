import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRoot } from '../models/user.model';
import { UserQueryFilters } from 'src/@types/filters';
import { User as IUser } from '../interfaces/user.interface';
import { PaginatedQuery } from 'src/@types/misc';
import { QueriesConstructor } from './query.constructors';

@Injectable()
export class UserRepository extends QueriesConstructor {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super();
  }

  async save(user: CreateUserDto): Promise<UserRoot> {
    const newUser = new this.userModel(user);
    const savedUser = await newUser.save();
    const userRoot = new UserRoot(savedUser._id);
    userRoot.user = savedUser;
    return userRoot;
  }

  async find(
    filters?: PaginatedQuery<UserQueryFilters>,
  ): Promise<{ data: User[]; total: [{ total: number }] }[]> {
    const $match = this.filters(filters.query);
    return await this.userModel.aggregate([
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
                from: 'properties',
                localField: 'properties',
                foreignField: '_id',
                as: 'properties',
              },
            },
            {
              $project: {
                password: 0,
                updatedAt: 0,
                __v: 0,
                createdAt: 0,
              },
            },
          ],
        },
      },
    ]);
  }

  async findUser(user: Partial<UserQueryFilters>): Promise<UserRoot> {
    const foundUser = await this.userModel.findOne(user);
    if (foundUser) {
      const userRoot = new UserRoot(foundUser._id);
      userRoot.user = foundUser;
      return userRoot;
    }
    return null;
  }

  async updateUser(
    filters: Partial<UserQueryFilters>,
    user: Partial<IUser>,
  ): Promise<UserRoot> {
    const updatedResult = await this.userModel.updateOne(filters, {
      $set: user,
    });
    if (!updatedResult.matchedCount) {
      throw new NotFoundException(`Couldn't find user`);
    }
    return await this.findUser(filters);
  }

  async deleteUser(filters: Partial<UserQueryFilters>) {
    return await this.userModel.deleteOne(filters);
  }

  async subscribe(email: string, propertyId: string) {
    const updatedResult = await this.userModel.updateOne(
      { email },
      {
        $push: { properties: propertyId },
      },
    );
    if (!updatedResult.matchedCount) {
      throw new NotFoundException(`Couldn't find user`);
    }
    return await this.findUser({ email });
  }

  async unsubscribe(email: string, propertyId: string) {
    const updatedResult = await this.userModel.updateOne(
      { email },
      {
        $pull: { properties: propertyId },
      },
    );
    if (!updatedResult.matchedCount) {
      throw new NotFoundException(`Couldn't find user`);
    }
    return await this.findUser({ email });
  }
}
