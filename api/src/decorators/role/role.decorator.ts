import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/@types/roles';

export const ROLE_KEY = 'role';
export const Role = (...args: ROLE[]): MethodDecorator =>
  SetMetadata(ROLE_KEY, args);
