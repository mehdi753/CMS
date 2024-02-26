import { ICommand } from '@nestjs/cqrs';

export class CreateHomePageCommand implements ICommand {
  constructor(public readonly website: string) {}
}
