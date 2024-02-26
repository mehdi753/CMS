import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feature } from '../schemas/feature.schema';
import { Model } from 'mongoose';
import { FeatureRoot } from '../models/feature.model';
import { FeatureQueryFilter } from 'src/@types/filters';
import { AddOrUpdateFeatureDto } from '../dto/add-or-update-feature.dto';
import { Feature as IFeature } from '../interfaces/feature.interface';

@Injectable()
export class FeatureRepository {
  constructor(
    @InjectModel(Feature.name) private readonly featureModel: Model<Feature>,
  ) {}

  async find(filters: Partial<FeatureQueryFilter>) {
    return await this.featureModel.find(filters);
  }

  async save(feature: AddOrUpdateFeatureDto): Promise<FeatureRoot> {
    const newFeature = new this.featureModel(feature);
    const savedFeature = await newFeature.save();
    const featureRoot = new FeatureRoot(savedFeature._id);
    featureRoot.feature = savedFeature;
    return featureRoot;
  }

  async deletePageFeatures(page: string): Promise<FeatureRoot[]> {
    const features = await this.find({ page });
    if (features.length) {
      await this.featureModel.deleteMany({ page });
      return features.map((f) => {
        const featureRoot = new FeatureRoot(f._id);
        featureRoot.feature = f;
        return featureRoot;
      });
    }
  }

  async addOrUpdateMultiple(
    features: IFeature[],
    page: string,
  ): Promise<FeatureRoot[]> {
    const indexes = [];
    const bulkWrite: any[] = features.map((feature) => {
      indexes.push(feature.index);
      return {
        replaceOne: {
          filter: { index: feature.index, page },
          replacement: feature,
          upsert: true,
        },
      };
    });

    const featuresToBeDeleted = await this.featureModel.find({
      page,
      index: { $nin: indexes },
    });

    bulkWrite.push({
      deleteMany: {
        filter: { page, index: { $nin: indexes } },
      },
    });

    await this.featureModel.bulkWrite(bulkWrite);

    const updatedFeatures = await this.find({ page });
    return [...updatedFeatures, ...featuresToBeDeleted].map((feature) => {
      const featureRoot = new FeatureRoot(feature._id);
      featureRoot.feature = feature;
      return featureRoot;
    });
  }
}
