import { IQuery } from '@nestjs/cqrs';

export class ValidateRecoverTokenQuery implements IQuery {
  constructor(public readonly token: string) {}
}
