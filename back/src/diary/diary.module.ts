import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from './diary.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity]),
    UserModule
  ],
  controllers: [DiaryController],
  providers: [DiaryService]
})
export class DiaryModule {}
