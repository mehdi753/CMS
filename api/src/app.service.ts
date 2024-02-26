import { Injectable } from '@nestjs/common';
import * as info from '../package.json';
import { ConfigService } from '@nestjs/config';

export interface WelcomeBody {
  name: string;
  version: string;
  env: string;
}

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): WelcomeBody {
    return {
      name: info.name,
      version: info.version,
      env: this.configService.get('NODE_ENV'),
    };
  }
}
