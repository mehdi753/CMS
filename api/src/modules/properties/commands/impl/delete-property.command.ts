import { ICommand } from '@nestjs/cqrs';

export class DeletePropertyCommand implements ICommand {
  constructor(public readonly id: string) {}
}
