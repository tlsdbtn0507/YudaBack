import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// @Controller()
@Controller('/api')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
