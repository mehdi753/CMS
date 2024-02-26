import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../impl/login.command';
import { UsersService } from '../../../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from 'src/modules/auth/interfaces/user-payload.interface';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginCommand): Promise<{ access_token: string }> {
    const { email, password } = command;
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(`User with email ${email} is not found!`);
    }
    const isValidPw = await bcrypt.compare(password, user.password);
    if (isValidPw && user) {
      const payload: UserPayload = {
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture || null,
        email: user.email,
        role: user.role,
      };
      const access_token = this.jwtService.sign(payload);
      return { access_token };
    }
    return null;
  }
}
