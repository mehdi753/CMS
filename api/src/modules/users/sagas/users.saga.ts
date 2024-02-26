import { Injectable } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, delay, map } from 'rxjs';
import { UserCreatedEvent } from '../events/impl/user-created.event';
import { MailerService } from 'src/modules/mailer/mailer.service';
import { RecoverUserEvent } from '../events/impl/recover-user.event';
import { MAIL_ACTION } from 'src/@types/mail-templates';
import { ConfigService } from '@nestjs/config';
import { PasswordResetEvent } from '../events/impl/password-reset.event';
import { UserVerifiedEvent } from '../events/impl/user-verified.event';

@Injectable()
export class UsersSaga {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  @Saga()
  userCreated = ($events: Observable<UserCreatedEvent>): Observable<ICommand> =>
    $events.pipe(
      ofType(UserCreatedEvent),
      delay(1000),
      map((event: UserCreatedEvent) => {
        this.mailerService.sendMail(event.user.email, MAIL_ACTION.VERIFY, {
          url: `${this.config.get(
            'APP.PUBLIC_URL',
          )}/verify/${event.getUserToken()}`,
        });
        return null;
      }),
    );

  @Saga()
  recoverUser = ($events: Observable<RecoverUserEvent>): Observable<ICommand> =>
    $events.pipe(
      ofType(RecoverUserEvent),
      delay(1000),
      map((event: RecoverUserEvent) => {
        this.mailerService.sendMail(event.user.email, MAIL_ACTION.RECOVER, {
          url: `${this.config.get(
            'APP.PUBLIC_URL',
          )}/recover/${event.getUserToken()}`,
        });
        return null;
      }),
    );

  @Saga()
  passwordReset = (
    $events: Observable<PasswordResetEvent>,
  ): Observable<ICommand> =>
    $events.pipe(
      ofType(PasswordResetEvent),
      delay(1000),
      map((event: PasswordResetEvent) => {
        this.mailerService.sendMail(
          event.user.email,
          MAIL_ACTION.PASSWORD_RESET,
        );
        return null;
      }),
    );

  @Saga()
  userVerified = (
    $events: Observable<UserVerifiedEvent>,
  ): Observable<ICommand> =>
    $events.pipe(
      ofType(UserVerifiedEvent),
      delay(1000),
      map((event: UserVerifiedEvent) => {
        this.mailerService.sendMail(
          event.user.email,
          MAIL_ACTION.USER_VERIFIED,
        );
        return null;
      }),
    );
}
