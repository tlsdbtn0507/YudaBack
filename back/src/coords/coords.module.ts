import { Module } from '@nestjs/common';
import { CoordService } from './coords.service';

@Module({
  providers: [CoordService],
  exports: [CoordService],  // 다른 모듈에서 사용할 수 있도록 내보냄
})
export class CoordsModule {}
