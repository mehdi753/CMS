import { PasswordResetHandler } from './password-reset.handlers';
import { RecoverUserHandler } from './recover-user.handler';
import { UserCreatedHandler } from './user-created.handler';
import { UserVerifiedHandler } from './user-verified.handler';

export const EventHandlers = [
  UserCreatedHandler,
  RecoverUserHandler,
  PasswordResetHandler,
  UserVerifiedHandler,
];
