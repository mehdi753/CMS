import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { FeatureRepository } from '../../repository/feature.repository';
import { UpdatePageFeaturesCommand } from '../impl/update-page-features.command';
import { Feature as IFeature } from '../../interfaces/feature.interface';
import {
  AddOrUpdateFeatureDto,
  BaseContentDto,
} from '../../dto/add-or-update-feature.dto';
import { FEATURE } from 'src/@types/features';

@CommandHandler(UpdatePageFeaturesCommand)
export class UpdatePageFeatureHandler
  implements ICommandHandler<UpdatePageFeaturesCommand>
{
  constructor(
    private readonly featureRepo: FeatureRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdatePageFeaturesCommand): Promise<void> {
    const { page, features } = command;
    const featuresList: IFeature[] = features
      .map((feature) => this.getFeature(feature, page))
      .filter(Boolean);
    const featuresRoots = await this.featureRepo.addOrUpdateMultiple(
      featuresList,
      page,
    );
    if (featuresRoots?.length) {
      for (const featureRoot of featuresRoots) {
        const featurePublisher = this.publisher.mergeObjectContext(featureRoot);
        const feature = features.find(
          (f) => f.index === featureRoot.feature.index,
        );
        if (feature) {
          featurePublisher.featureUpdated(this.getContent(feature));
        } else {
          featurePublisher.featureUpdated(undefined, true);
        }
        featurePublisher.commit();
      }
    }
  }

  getFeature(feature: AddOrUpdateFeatureDto, page: string): IFeature {
    switch (feature.name) {
      case FEATURE.CONTENT:
        return {
          name: FEATURE.CONTENT,
          index: feature.index,
          page,
          title: feature.title,
          description: feature.description,
          images: feature.images,
        };
      case FEATURE.GALLERY:
        return {
          _id: feature._id,
          name: FEATURE.GALLERY,
          index: feature.index,
          page,
          images: feature.images,
        };
      case FEATURE.CONTACT:
        return null;
      // return {
      //   name: FEATURE.CONTACT,
      //   index: feature.index,
      //   page,
      // };
      case FEATURE.LOCATION:
        return {
          name: FEATURE.LOCATION,
          index: feature.index,
          page,
        };
      default:
        return null;
    }
  }

  getContent(feature: AddOrUpdateFeatureDto): BaseContentDto {
    switch (feature.name) {
      default:
        return null;
    }
  }
}
