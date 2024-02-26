import { AddUserHandler } from './add-user.handler';
import { DeleteUserHandler } from './delete-user.handler';
import { RecoverUserHandler } from './recover-user.handler';
import { ResetPasswordHandler } from './reset-password.handler';
import { SendVerifyHandler } from './send-verify.handler';
import { SignupHandler } from './signup.handler';
import { SubscribeHandler } from './subscribe.handler';
import { UpdateUserHandler } from './update-user.handler';
import { VerifyUserHandler } from './verify-user.handler';

export const CommandHandlers = [
  SignupHandler,
  AddUserHandler,
  SubscribeHandler,
  UpdateUserHandler,
  VerifyUserHandler,
  DeleteUserHandler,
  SendVerifyHandler,
  RecoverUserHandler,
  ResetPasswordHandler,
];
