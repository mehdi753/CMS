import { ICommand } from '@nestjs/cqrs';

export class DeleteWebsitePagesCommand implements ICommand {
  constructor(public readonly website: string) {}
}
