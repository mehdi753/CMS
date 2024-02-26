import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { CreateWebsiteCommand } from './commands/impl/create-website.command';
import { Website } from './schemas/website.schema';
import { WebsiteQueryFilters } from 'src/@types/filters';
import { GetWebsiteInfoQuery } from './queries/impl/get-website-info.query';
import { DeleteWebsiteCommand } from './commands/impl/delete-website.command';
import { PaginatedQuery, PaginatedResults } from 'src/@types/misc';
import { GetWebsitesQuery } from './queries/impl/get-websites.query';
import { FindWebsiteQuery } from './queries/impl/find-website.query';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { UpdateWebsiteCommand } from './commands/impl/update-website.command';
import { GetWebsitePagesQuery } from './queries/impl/get-website-pages.query';

@Injectable()
export class WebsitesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getWebsitePages(origin: string): Promise<string[]> {
    return await this.queryBus.execute(new GetWebsitePagesQuery(origin));
  }

  async getWebsites(
    filters: PaginatedQuery<WebsiteQueryFilters>,
  ): Promise<PaginatedResults<Website>> {
    return await this.queryBus.execute(new GetWebsitesQuery(filters));
  }

  async createWebsite(website: CreateWebsiteDto): Promise<Website> {
    return await this.commandBus.execute(new CreateWebsiteCommand(website));
  }

  async findWebsite(filters: Partial<WebsiteQueryFilters>): Promise<Website> {
    return await this.queryBus.execute(new FindWebsiteQuery(filters));
  }

  async getWebsiteInfo(
    filters: Partial<WebsiteQueryFilters>,
  ): Promise<Website> {
    return await this.queryBus.execute(new GetWebsiteInfoQuery(filters));
  }

  async deletePropertyWebsite(property: string): Promise<void> {
    return await this.commandBus.execute(new DeleteWebsiteCommand(property));
  }

  async updateWebsite(data: UpdateWebsiteDto) {
    return await this.commandBus.execute(new UpdateWebsiteCommand(data));
  }
}
