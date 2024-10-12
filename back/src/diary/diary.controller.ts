import { Body, Controller, Post, UsePipes, ValidationPipe,Get, Param, UseGuards } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { WriteDiaryDTO } from './dto/writeDiary.dto';
import { UserEntity } from 'src/user/user.entity';
import { GetUser } from 'src/configs/get-user.decorator';
import { JwtAuthGuard } from 'src/configs/JwtAuthGuard';

@Controller('/api/diary')
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(private diaryService: DiaryService) { }
  

  @Post()
  @UsePipes(ValidationPipe)
  writeDiary(
    @Body() writeDiaryDTO: WriteDiaryDTO,
    @GetUser() user : UserEntity
  ) {
    const { lat, long, diaryDate } = writeDiaryDTO;
    return this.diaryService.getRealWeather(lat, long,diaryDate);
    // return this.diaryService.writeDiary(writeDiaryDTO, user);
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
