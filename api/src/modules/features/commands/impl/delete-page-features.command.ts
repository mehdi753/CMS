import { ICommand } from '@nestjs/cqrs';

export class DeletePageFeaturesCommand implements ICommand {
  constructor(public readonly page: string) {}
}
