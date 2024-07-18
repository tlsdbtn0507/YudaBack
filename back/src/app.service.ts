import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'+`${process.env.NODE_ENV} and ${process.env.CUR_VERSION}`;
  }
}
