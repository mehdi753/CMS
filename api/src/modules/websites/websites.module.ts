import { Module } from '@nestjs/common';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from './queries/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { MailerService } from '../mailer/mailer.service';
import { WebsiteRepository } from './repository/website.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Website, WebsiteSchema } from './schemas/website.schema';
import { PagesService } from '../pages/pages.service';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeatureAsync([
      {
        name: Website.name,
        collection: Website.name,
        useFactory: () => WebsiteSchema,
      },
    ]),
  ],
  providers: [
    PagesService,
    MailerService,
    WebsitesService,
    ...EventHandlers,
    ...QueryHandlers,
    WebsiteRepository,
    ...CommandHandlers,
  ],
  exports: [WebsitesService],
  controllers: [WebsitesController],
})
export class WebsitesModule {}
