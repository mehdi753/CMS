import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '../impl/get-users.query';
import { UserRepository } from '../../repository/user.repository';
import { User } from '../../schemas/user.schema';
import { PaginatedResults } from 'src/@types/misc';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(query: GetUsersQuery): Promise<PaginatedResults<User>> {
    const { filters } = query;
    const users = await this.userRepo.find(filters);
    const { limit, offset } = filters;
    return {
      limit,
      offset,
      list: users[0].data,
      total: Math.ceil((users?.[0]?.total?.[0]?.total || 0) / limit),
    };
  }
}
