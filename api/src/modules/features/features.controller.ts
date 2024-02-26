import { Body, Controller, Post } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { AddOrUpdateFeatureDto } from './dto/add-or-update-feature.dto';

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  async addFeature(@Body() feature: AddOrUpdateFeatureDto) {
    return await this.featuresService.addFeature(feature);
  }
}
