import { Body, Controller, Post, UsePipes, ValidationPipe,Get, Param, UseGuards } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDTO } from './dto/createDiary.dto';
import { UserEntity } from 'src/user/user.entity';
import { GetUser } from 'src/configs/get-user.decorator';
import { JwtAuthGuard } from 'src/configs/JwtAuthGuard';

@Controller('/api/diary')
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(private diaryService: DiaryService) { }
  

  @Post()
  @UsePipes(ValidationPipe)
  createDiary(
    @Body() createDiaryDTO: CreateDiaryDTO,
    @GetUser() user : UserEntity
  ) {
    return this.diaryService.createDiary(createDiaryDTO, user);
  }

  @Get()
  getDiaries(
    @GetUser() user: UserEntity
  ) {
    try {
      return this.diaryService.getDiaries(user);
    } catch (error) {
      throw new Error('Could not fetch diaries');
    }
  }

  @Get('/:id')
  getMoreDiaries(
    @GetUser() user: UserEntity, @Param('id') id: number
  ) {
    try {
      return this.diaryService.getMoreDiaries(user,id)
    } catch (error) {
      
    }
  }
}
