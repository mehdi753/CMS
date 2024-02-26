import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLE } from 'src/@types/roles';
import { ROLE_KEY } from 'src/decorators/role/role.decorator';
import { UserPayload } from 'src/modules/auth/interfaces/user-payload.interface';

@Injectable()
export class RoleGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    return await super.canActivate(context);
  }

  handleRequest(
    error: any,
    user: UserPayload,
    _info: object,
    context: ExecutionContext,
  ): any {
    if (error || !user) {
      throw new UnauthorizedException();
    }

    const roles = this.reflector.getAllAndOverride<ROLE[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || !roles.length) {
      return true;
    }

    return roles.includes(user.role);
  }
}
