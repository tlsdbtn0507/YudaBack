import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe,Get, Param, Req } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDTO } from './dto/createDiary.dto';
import { GetUser } from 'src/configs/get-user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/diary')
@UseGuards(AuthGuard())
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
  getDiaries(@GetUser() user: UserEntity) {
    try {
      return this.diaryService.getDiaries(user);
    } catch (error) {
      throw new Error('Could not fetch diaries');
    }
  }

  @Get('/:id')
  getMoreDiaries(@GetUser() user: UserEntity, @Param('id') id: number) {
    try {
      return this.diaryService.getMoreDiaries(user,id)
    } catch (error) {
      
    }
  }
}
