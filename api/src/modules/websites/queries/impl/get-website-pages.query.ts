import { IQuery } from '@nestjs/cqrs';

export class GetWebsitePagesQuery implements IQuery {
  constructor(public readonly website: string) {}
}
