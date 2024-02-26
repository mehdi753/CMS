import { InjectModel } from '@nestjs/mongoose';
import { Page } from '../schemas/page.schema';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AddPageDto } from '../dto/add-page.dto';
import { PageRoot } from '../models/page.model';
import { PageQueryFilters } from 'src/@types/filters';
import { Page as IPage } from '../interfaces/page.interface';
import { Website } from 'src/modules/websites/schemas/website.schema';
import { Website as IWebsite } from 'src/modules/websites/interfaces/website.interface';
import { Property } from 'src/modules/properties/interfaces/property.interface';
import { Feature } from 'src/modules/features/schemas/feature.schema';
import { FEATURE } from 'src/@types/features';
import { FormattedPage } from '../interfaces/formatted-page.interface';

@Injectable()
export class PageRepository {
  constructor(
    @InjectModel(Page.name) private readonly pageModel: Model<Page>,
  ) {}

  async findPage(page: Partial<PageQueryFilters>): Promise<PageRoot> {
    const foundPage = await this.pageModel.findOne(page);
    if (foundPage) {
      const pageRoot = new PageRoot(foundPage._id);
      pageRoot.page = foundPage;
      return pageRoot;
    }
    return null;
  }

  async find(filters: Partial<PageQueryFilters>): Promise<Page[]> {
    return await this.pageModel.find(filters);
  }

  async save(page: AddPageDto): Promise<PageRoot> {
    const newPage = new this.pageModel(page);
    const savedPage = await newPage.save();
    const pageRoot = new PageRoot(savedPage._id);
    pageRoot.page = savedPage;
    return pageRoot;
  }

  async deleteWebsitePages(website: string): Promise<PageRoot[]> {
    const pages = await this.find({ website });
    if (!pages?.length) {
      throw new NotFoundException(
        `Couldn't find pages with website id: ${website}`,
      );
    }
    await this.pageModel.deleteMany({ website });
    return pages.map((page) => new PageRoot(page._id));
  }

  async addOrUpdateMultiple(
    pages: IPage[],
    website: string,
  ): Promise<PageRoot[]> {
    const indexes = [];
    const bulkWrite: any[] = pages.map((page) => {
      indexes.push(page.index);
      return {
        updateOne: {
          filter: { index: page.index, website },
          update: { $set: page },
          upsert: true,
        },
      };
    });
    bulkWrite.push({
      deleteMany: {
        filter: { website, index: { $nin: indexes } },
      },
    });
    await this.pageModel.bulkWrite(bulkWrite);

    const updatedPages = await this.find({ website });
    return updatedPages.map((page) => {
      const pageRoot = new PageRoot(page._id);
      pageRoot.page = page;
      return pageRoot;
    });
  }

  async getPageContent(
    filters: Partial<PageQueryFilters>,
    language: string,
  ): Promise<FormattedPage> {
    const pages = await this.pageModel
      .aggregate([
        {
          $match: {
            name: {
              $regex: filters.name,
              $options: 'i',
            },
          },
        },
        {
          $lookup: {
            from: Website.name,
            localField: 'website',
            foreignField: '_id',
            as: 'website',
            pipeline: [
              {
                $match: {
                  name: filters.website,
                },
              },
            ],
          },
        },
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
      ])
      .then((res) => this.transformGetPageContentAggregation(res, language));
    return pages?.[0] || null;
  }

  private transformGetPageContentAggregation(
    pages,
    language: string,
  ): FormattedPage[] {
    if (pages.length) {
      pages = pages.map((page) => ({
        ...page,
        features: page.features
          .map((feature) => [
            feature.content?.[0]
              ? {
                  ...feature.content[0],
                  title:
                    feature.content[0].title?.[language] ||
                    feature.content[0].title?.['en'],
                  description:
                    feature.content[0].description?.[language] ||
                    feature.content[0].description?.['en'],
                }
              : undefined,
            feature.contact[0],
            feature.location[0],
            feature.gallery[0],
          ])
          .flat(2)
          .filter(Boolean),
      }));
    }
    return pages;
  }

  async getProperty(filters: Partial<PageQueryFilters>): Promise<Property> {
    const page = await this.pageModel
      .findOne({ name: { $regex: filters.name, $options: 'i' } })
      .populate({
        path: 'website',
        match: { url: filters.website },
        populate: {
          path: 'property',
        },
      });
    if ((page?.website as unknown as IWebsite)?.property) {
      return (page.website as unknown as IWebsite).property as Property;
    }
    return null;
  }
}
