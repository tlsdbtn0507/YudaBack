import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from './diary.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity]),
    UserModule,
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
    HttpModule
  ],
  controllers: [DiaryController],
  providers: [DiaryService]
})
export class DiaryModule {}
