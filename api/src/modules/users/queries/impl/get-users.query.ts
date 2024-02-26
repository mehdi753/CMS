import { IQuery } from '@nestjs/cqrs';
import { UserQueryFilters } from 'src/@types/filters';
import { PaginatedQuery } from 'src/@types/misc';

export class GetUsersQuery implements IQuery {
  constructor(public readonly filters: PaginatedQuery<UserQueryFilters>) {}
}
