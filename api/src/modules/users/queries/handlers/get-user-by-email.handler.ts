import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByEmailQuery } from '../impl/get-user-by-email.query';
import { UserRepository } from '../../repository/user.repository';
import { User } from '../../schemas/user.schema';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery>
{
  constructor(private readonly userRepo: UserRepository) {}

  async execute(query: GetUserByEmailQuery): Promise<User> {
    const { email } = query;
    const userRoot = await this.userRepo.findUser({ email });
    return userRoot?.user;
  }
}
