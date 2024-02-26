import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { Page, PageSchema } from './schemas/page.schema';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from './queries/handlers';
import { PageRepository } from './repository/page.repository';
import { FeaturesService } from '../features/features.service';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeatureAsync([
      {
        name: Page.name,
        collection: Page.name,
        useFactory: () => PageSchema,
      },
    ]),
  ],
  providers: [
    PagesService,
    PageRepository,
    FeaturesService,
    ...EventHandlers,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
  exports: [PagesService],
  controllers: [PagesController],
})
export class PagesModule {}
