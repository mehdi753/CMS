import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddFeatureCommand } from './commands/impl/add-feature.command';
import { DeletePageFeaturesCommand } from './commands/impl/delete-page-features.command';
import { Feature } from './schemas/feature.schema';
import { AddOrUpdateFeatureDto } from './dto/add-or-update-feature.dto';
import { UpdatePageFeaturesCommand } from './commands/impl/update-page-features.command';

@Injectable()
export class FeaturesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async addFeature(feature: AddOrUpdateFeatureDto): Promise<Feature> {
    return await this.commandBus.execute(new AddFeatureCommand(feature));
  }

  async deletePageFeatures(page: string): Promise<void> {
    await await this.commandBus.execute(new DeletePageFeaturesCommand(page));
  }

  async updatePageFeatures(
    page: string,
    features: AddOrUpdateFeatureDto[],
  ): Promise<void> {
    return await this.commandBus.execute(
      new UpdatePageFeaturesCommand(page, features),
    );
  }
}
