import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/impl/login.command';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private commandBus: CommandBus) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<{ access_token }> {
    const user = await this.commandBus.execute(
      new LoginCommand(email, password),
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
