import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { User } from '../users/interfaces/user.interface';
import { GetUserInfoQuery } from './queries/impl/get-user-info.query';

@Injectable()
export class AuthService {
  constructor(private readonly queryBus: QueryBus) {}

  async getUserInfo(email: string): Promise<User> {
    return await this.queryBus.execute(new GetUserInfoQuery(email));
  }
}
