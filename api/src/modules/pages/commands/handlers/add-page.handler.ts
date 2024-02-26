import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddPageCommand } from '../impl/add-page.command';
import { PageRepository } from '../../repository/page.repository';
import { Page } from '../../schemas/page.schema';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(AddPageCommand)
export class AddPageHandler implements ICommandHandler<AddPageCommand> {
  constructor(private readonly pageRepo: PageRepository) {}

  async execute(command: AddPageCommand): Promise<Page> {
    const { pageDto } = command;
    const page = await this.pageRepo.findPage(pageDto);
    if (page) {
      throw new BadRequestException('Page already exists');
    }
    const pageRoot = await this.pageRepo.save(pageDto);
    return pageRoot.page;
  }
}
