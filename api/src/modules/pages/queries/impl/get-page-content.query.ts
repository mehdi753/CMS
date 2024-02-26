import { IQuery } from '@nestjs/cqrs';

export class getPageContentQuery implements IQuery {
  constructor(
    public readonly website: string,
    public readonly name: string,
    public readonly language: string,
  ) {}
}
