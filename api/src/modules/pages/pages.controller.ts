import { Controller, Get, Param } from '@nestjs/common';
import { Origin } from 'src/decorators/origin/origin.decorator';
import { PagesService } from './pages.service';
import { FormattedPage } from './interfaces/formatted-page.interface';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get(':lang/:name')
  async getPageContent(
    @Param('name') name: string,
    @Param('lang') lang: string,
    @Origin() origin: string,
  ): Promise<FormattedPage> {
    return await this.pagesService.getPageContent(origin, name, lang);
  }
}
