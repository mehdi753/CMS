import { ICommand } from '@nestjs/cqrs';

export class DeleteWebsiteCommand implements ICommand {
  constructor(public readonly property: string) {}
}
