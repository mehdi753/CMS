import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { Website } from './schemas/website.schema';
import { PaginatedQuery, PaginatedResults } from 'src/@types/misc';
import { WebsiteQueryFilters } from 'src/@types/filters';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { Origin } from 'src/decorators/origin/origin.decorator';

@Controller('websites')
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  @Get()
  async getWebsitePages(@Origin() origin: string): Promise<string[]> {
    return await this.websitesService.getWebsitePages(origin);
  }

  @Get(':id')
  async getWebsiteInfo(@Param('id') _id: string): Promise<Website> {
    return await this.websitesService.getWebsiteInfo({ _id });
  }

  @Post()
  async getWebsites(
    @Body() filters: PaginatedQuery<WebsiteQueryFilters>,
  ): Promise<PaginatedResults<Website>> {
    return await this.websitesService.getWebsites(filters);
  }

  @Put()
  async updateWebsite(@Body() data: UpdateWebsiteDto) {
    return await this.websitesService.updateWebsite(data);
  }
}
