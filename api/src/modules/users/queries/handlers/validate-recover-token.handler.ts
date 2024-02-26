import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ValidateRecoverTokenQuery } from '../impl/validate-recover-token.query';
import { Cache as CacheManager } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@QueryHandler(ValidateRecoverTokenQuery)
export class ValidateRecoverTokenHandler
  implements IQueryHandler<ValidateRecoverTokenQuery>
{
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}

  async execute(
    query: ValidateRecoverTokenQuery,
  ): Promise<{ isValid: boolean }> {
    const { token } = query;
    const userId = await this.cacheManager.get(`recover_user_token_${token}`);
    return { isValid: !!userId };
  }
}
