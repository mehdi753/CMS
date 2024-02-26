import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Website } from '../schemas/website.schema';
import { Model } from 'mongoose';
import { CreateWebsiteDto } from '../dto/create-website.dto';
import { WebsiteRoot } from '../models/website.model';
import { WebsiteQueryFilters } from 'src/@types/filters';
import { PaginatedQuery } from 'src/@types/misc';
import { QueriesConstructor } from './query.constructor';
import { Property } from 'src/modules/properties/schemas/property.schema';
import { Page } from 'src/modules/pages/schemas/page.schema';
import { Feature } from 'src/modules/features/schemas/feature.schema';
import { Website as IWebsite } from '../interfaces/website.interface';
import { FEATURE } from 'src/@types/features';

@Injectable()
export class WebsiteRepository extends QueriesConstructor {
  constructor(
    @InjectModel(Website.name) private readonly websiteModel: Model<Website>,
  ) {
    super();
  }

  async find(filters?: PaginatedQuery<WebsiteQueryFilters>) {
    const $match = this.filters(filters.query);

    const websites = await this.websiteModel
      .aggregate([
        {
          $match,
        },
        {
          $skip: (filters.offset - 1) * filters.limit,
        },
        {
          $limit: filters.limit,
        },
        {
          $lookup: {
            from: Property.name,
            localField: 'property',
            foreignField: '_id',
            as: 'property',
          },
        },
        {
          $unwind: { path: '$property' },
        },
        {
          $lookup: {
            from: Page.name,
            localField: '_id',
            foreignField: 'website',
            as: 'pages',
            pipeline: [
              {
                $lookup: {
                  from: Feature.name,
                  localField: '_id',
                  foreignField: 'page',
                  let: { name: '$name' },
                  as: 'features',
                  pipeline: [
                    {
                      $facet: {
                        contact: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$name', FEATURE.CONTACT],
                              },
                            },
                          },
                        ],
                        content: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$name', FEATURE.CONTENT],
                              },
                            },
                          },
                        ],
                        gallery: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$name', FEATURE.GALLERY],
                              },
                            },
                          },
                        ],
                        location: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$name', FEATURE.LOCATION],
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ])
      .then(this.transformGetWebsiteAggregation);

    const totals = await this.websiteModel.aggregate([
      {
        $match,
      },
      { $count: 'total' },
    ]);
    return { websites, totals };
  }

  async getWebsiteInfo(
    website: Partial<WebsiteQueryFilters>,
  ): Promise<WebsiteRoot> {
    const $match = this.filters(website);
    const foundWebsite = await this.websiteModel
      .aggregate([
        {
          $match,
        },
        {
          $lookup: {
            from: Property.name,
            localField: 'property',
            foreignField: '_id',
            as: 'property',
          },
        },
        {
          $unwind: { path: '$property' },
        },
        {
          $lookup: {
            from: Page.name,
            localField: '_id',
            foreignField: 'website',
            as: 'pages',
            pipeline: [
              {
                $lookup: {
                  from: Feature.name,
                  localField: '_id',
                  foreignField: 'page',
                  let: { name: '$name' },
                  as: 'features',
                  pipeline: [
                    {
                      $facet: {
                        contact: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$name', FEATURE.CONTACT],
                              },
                            },
                          },
                        ],
                        content: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$name', FEATURE.CONTENT],
                              },
                            },
                          },
                        ],
                        gallery: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$name', FEATURE.GALLERY],
                              },
                            },
                          },
                        ],
                        location: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$name', FEATURE.LOCATION],
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ])
      .then(this.transformGetWebsiteAggregation);
    if (foundWebsite?.length) {
      const websiteRoot = new WebsiteRoot(foundWebsite[0]._id);
      websiteRoot.website = foundWebsite[0];
      return websiteRoot;
    }
    return null;
  }

  async findWebsite(
    filters: Partial<WebsiteQueryFilters>,
  ): Promise<WebsiteRoot> {
    const $match = this.filters(filters);
    const website = await this.websiteModel.findOne($match);
    if (website) {
      const websiteRoot = new WebsiteRoot(website._id);
      websiteRoot.website = website;
      return websiteRoot;
    }
    return null;
  }

  async save(website: CreateWebsiteDto): Promise<WebsiteRoot> {
    const newWebsite = new this.websiteModel(website);
    const savedWebsite = await newWebsite.save();
    const websiteRoot = new WebsiteRoot(savedWebsite._id);
    websiteRoot.website = savedWebsite;
    return websiteRoot;
  }

  async deleteWebsiteByPropertyId(property: string): Promise<WebsiteRoot> {
    const website = await this.findWebsite({ property });
    if (!website?.website) {
      throw new NotFoundException(
        `Couldn't find website with proeprty id: ${property}`,
      );
    }
    const res = await this.websiteModel.findByIdAndDelete(website.website._id);
    if (res) {
      return new WebsiteRoot(website.website._id);
    }
    return null;
  }

  async update(
    filters: Partial<WebsiteQueryFilters>,
    website: Partial<IWebsite>,
  ) {
    const updatedResult = await this.websiteModel.updateOne(filters, {
      $set: website,
    });
    if (!updatedResult.matchedCount) {
      throw new NotFoundException(`Couldn't find Website`);
    }
    return await this.findWebsite(filters);
  }

  async getWebsitePages(
    filters: Partial<WebsiteQueryFilters>,
  ): Promise<Page[]> {
    const $match = this.filters(filters);
    return await this.websiteModel
      .aggregate([
        { $match },
        {
          $lookup: {
            from: Page.name,
            localField: '_id',
            foreignField: 'website',
            as: 'pages',
          },
        },
      ])
      .then((res) => res?.[0]?.pages);
  }

  private transformGetWebsiteAggregation(websites) {
    if (websites.length) {
      websites = websites.map((website) => ({
        ...website,
        pages: website.pages.map((page) => ({
          ...page,
          features: page.features
            .map((feature) => [
              feature.contact[0],
              feature.content[0],
              feature.location[0],
              feature.gallery[0],
            ])
            .flat(2)
            .filter(Boolean),
        })),
      }));
    }
    return websites;
  }
}
