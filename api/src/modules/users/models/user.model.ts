import { AggregateRoot } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../events/impl/user-created.event';
import { User } from '../schemas/user.schema';
import { RecoverUserEvent } from '../events/impl/recover-user.event';
import { PasswordResetEvent } from '../events/impl/password-reset.event';
import { UserVerifiedEvent } from '../events/impl/user-verified.event';

export class UserRoot extends AggregateRoot {
  private _user: User;
  private _token: string;

  constructor(private readonly id?: string) {
    super();
  }

  public set user(user: User) {
    this._user = user;
  }

  public get user(): User {
    return this._user;
  }

  public set token(token: string) {
    this._token = token;
  }
  public get token(): string {
    return this._token;
  }

  public userCreated(): void {
    this.apply(new UserCreatedEvent(this.id, this._user));
  }

  public recoverUser(): void {
    this.apply(new RecoverUserEvent(this.id, this._user));
  }

  public passwordReset(): void {
    this.apply(new PasswordResetEvent(this.id, this._token, this._user));
  }

  public userVerified(): void {
    this.apply(new UserVerifiedEvent(this.id, this._token, this._user));
  }
}
