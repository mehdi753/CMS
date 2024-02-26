import { GetUserByEmailHandler } from './get-user-by-email.handler';
import { GetUsersHandler } from './get-users.handlers';
import { ValidateRecoverTokenHandler } from './validate-recover-token.handler';

export const QueryHandlers = [
  GetUsersHandler,
  GetUserByEmailHandler,
  ValidateRecoverTokenHandler,
];
