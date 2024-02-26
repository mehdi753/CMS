import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserInfoQuery } from '../impl/get-user-info.query';
import { UsersService } from '../../../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/modules/users/interfaces/user.interface';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoHandler implements IQueryHandler<GetUserInfoQuery> {
  constructor(private readonly usersService: UsersService) {}

  async execute(command: GetUserInfoQuery): Promise<User> {
    const { email } = command;
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(`User with email ${email} is not found!`);
    }
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      email: user.email,
      role: user.role,
      verified: user.verified,
    };
  }
}
