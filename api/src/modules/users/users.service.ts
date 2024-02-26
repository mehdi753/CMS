import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dto/create-user.dto';
import { SignupCommand } from './commands/impl/signup.command';
import { GetUsersQuery } from './queries/impl/get-users.query';
import { User } from './schemas/user.schema';
import { GetUserByEmailQuery } from './queries/impl/get-user-by-email.query';
import { RecoverUserDto } from './dto/recover-user.dto';
import { RecoverUserCommand } from './commands/impl/recover-user.command';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidateRecoverTokenQuery } from './queries/impl/validate-recover-token.query';
import { ResetPasswordCommand } from './commands/impl/reset-password.command';
import { VerifyUserCommand } from './commands/impl/verify-user.command';
import { SendVerifyDto } from './dto/send-verify.dto';
import { SendVerifyCommand } from './commands/impl/send-verify.command';
import { AddUserCommand } from './commands/impl/add-user.command';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserCommand } from './commands/impl/update-user.command';
import { DeleteUserCommand } from './commands/impl/delete-user.command';
import { SubscribeDto } from '../properties/dto/subscribe.dto';
import { SubscribeCommand } from './commands/impl/subscribe.command';
import { PaginatedQuery, PaginatedResults } from 'src/@types/misc';
import { UserQueryFilters } from 'src/@types/filters';

@Injectable()
export class UsersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async signup(user: CreateUserDto): Promise<void> {
    return await await this.commandBus.execute(new SignupCommand(user));
  }

  async getUsers(
    filters: PaginatedQuery<UserQueryFilters>,
  ): Promise<PaginatedResults<User>> {
    return await this.queryBus.execute(new GetUsersQuery(filters));
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.queryBus.execute(new GetUserByEmailQuery(email));
  }

  async recover(user: RecoverUserDto): Promise<void> {
    return await this.commandBus.execute(new RecoverUserCommand(user));
  }

  async validateRecoverToken(token: string): Promise<{ isValid: boolean }> {
    return await this.queryBus.execute(new ValidateRecoverTokenQuery(token));
  }

  async resetPassword(user: ResetPasswordDto): Promise<void> {
    return await this.commandBus.execute(new ResetPasswordCommand(user));
  }

  async verifyUser(token: string): Promise<void> {
    return await this.commandBus.execute(new VerifyUserCommand(token));
  }

  async sendVerify(user: SendVerifyDto): Promise<void> {
    return await this.commandBus.execute(new SendVerifyCommand(user));
  }

  async addUser(user: CreateUserDto): Promise<User> {
    return await this.commandBus.execute(new AddUserCommand(user));
  }

  async updateUser(user: UpdateUserDto): Promise<User> {
    return await this.commandBus.execute(new UpdateUserCommand(user));
  }

  async deleteUser(email: string): Promise<void> {
    return await this.commandBus.execute(new DeleteUserCommand(email));
  }

  async subscribeToProperty(subscribeDto: SubscribeDto) {
    return await this.commandBus.execute(new SubscribeCommand(subscribeDto));
  }
}
