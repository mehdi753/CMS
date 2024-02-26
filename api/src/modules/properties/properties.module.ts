import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from './queries/handlers';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './schemas/property.schema';
import { MailerService } from '../mailer/mailer.service';
import { PropertyRepository } from './repository/property.repository';
import { UsersService } from '../users/users.service';
import { WebsitesService } from '../websites/websites.service';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeatureAsync([
      {
        name: Property.name,
        collection: Property.name,
        useFactory: () => PropertySchema,
      },
    ]),
  ],
  providers: [
    UsersService,
    MailerService,
    WebsitesService,
    ...EventHandlers,
    ...QueryHandlers,
    PropertiesService,
    ...CommandHandlers,
    PropertyRepository,
  ],
  controllers: [PropertiesController],
})
export class PropertiesModule {}
