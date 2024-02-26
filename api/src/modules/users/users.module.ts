import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from '../users/schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from './queries/handlers';
import { UsersSaga } from './sagas/users.saga';
import { UserRepository } from './repository/user.repository';
import { MailerService } from '../mailer/mailer.service';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        collection: User.name,
        useFactory: () => UsersSchema,
      },
    ]),
  ],
  providers: [
    UsersSaga,
    UsersService,
    MailerService,
    UserRepository,
    ...EventHandlers,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
