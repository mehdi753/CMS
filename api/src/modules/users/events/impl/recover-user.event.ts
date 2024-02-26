import { User } from '../../schemas/user.schema';

export class RecoverUserEvent {
  constructor(public readonly userId: string, public readonly user: User) {}

  private userToken: string;

  public setUserToken(token: string): void {
    this.userToken = token;
  }

  public getUserToken(): string {
    return this.userToken;
  }
}
