import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddPageDto } from './dto/add-page.dto';
import { AddPageCommand } from './commands/impl/add-page.command';
import { CreateHomePageCommand } from './commands/impl/create-home-page.command';
import { Page } from './schemas/page.schema';
import { DeleteWebsitePagesCommand } from './commands/impl/delete-website-pages.command';
import { AddOrUpdatePageDto } from './dto/add-or-update-page.dto';
import { UpdateWebsitePagesCommand } from './commands/impl/update-website-pages.command';
import { getPageContentQuery } from './queries/impl/get-page-content.query';
import { FormattedPage } from './interfaces/formatted-page.interface';

@Injectable()
export class PagesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async addPage(page: AddPageDto): Promise<Page> {
    return await this.commandBus.execute(new AddPageCommand(page));
  }

  async createHomePage(website: string): Promise<Page> {
    return await this.commandBus.execute(new CreateHomePageCommand(website));
  }

  async deletePagesByWebsite(website: string): Promise<void> {
    return await this.commandBus.execute(
      new DeleteWebsitePagesCommand(website),
    );
  }

  async updateWebsitePages(website: string, pages: AddOrUpdatePageDto[]) {
    return await this.commandBus.execute(
      new UpdateWebsitePagesCommand(website, pages),
    );
  }

  async getPageContent(
    website: string,
    pageName: string,
    lang: string,
  ): Promise<FormattedPage> {
    return await this.queryBus.execute(
      new getPageContentQuery(website, pageName, lang),
    );
  }
}
