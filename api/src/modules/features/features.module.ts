import { Module } from '@nestjs/common';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import { CqrsModule } from '@nestjs/cqrs';
import { Feature, FeatureSchema } from './schemas/feature.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from './queries/handlers';
import { FeatureRepository } from './repository/feature.repository';
import { GallerySchema } from './schemas/gallery.schema';
import { ContentSchema } from './schemas/content.schema';
import { FEATURE } from 'src/@types/features';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeatureAsync([
      {
        name: Feature.name,
        collection: Feature.name,
        useFactory: () => FeatureSchema,
        discriminators: [
          { name: FEATURE.GALLERY, schema: GallerySchema },
          { name: FEATURE.CONTENT, schema: ContentSchema },
        ],
      },
    ]),
  ],
  providers: [
    FeaturesService,
    ...EventHandlers,
    ...QueryHandlers,
    FeatureRepository,
    ...CommandHandlers,
  ],
  exports: [FeaturesService],
  controllers: [FeaturesController],
})
export class FeaturesModule {}
