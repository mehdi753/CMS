import { User } from '../../schemas/user.schema';

export class UserVerifiedEvent {
  constructor(
    public readonly userId: string,
    public readonly token: string,
    public readonly user: User,
  ) {}
}
