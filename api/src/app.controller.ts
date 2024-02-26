import { Controller, Get } from '@nestjs/common';
import { AppService, WelcomeBody } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): WelcomeBody {
    return this.appService.getHello();
  }
}
