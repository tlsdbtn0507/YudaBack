import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryEntity } from './diary.entity';
import { LessThan, Repository } from 'typeorm';
import { WriteDiaryDTO } from './dto/writeDiary.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(DiaryEntity)
    private diaryService : Repository<DiaryEntity>
  ) { }
  private readonly logger = new Logger(DiaryService.name);

  
  async writeDiary(writeDiaryDTO:WriteDiaryDTO,user:UserEntity) {
    const diary = this.diaryService.create({ ...writeDiaryDTO, user });
    
    await this.diaryService.save(diary)

    return diary
  }

  async getDiaries(user: UserEntity) {
    this.logger.log(`Fetching diaries for user: ${user.id}`);

    const diaries = await this.diaryService.find({
      where: { user },
      order: {
        id:'DESC'
      },
      take: 5,
      skip:0
    });

    return diaries

  };

  async getMoreDiaries(user:UserEntity,lessId:number) {
    const diaries = await this.diaryService.find({
      where: { user, id:LessThan(lessId)  },
      order: {
        id: 'DESC'
      },
      take: 5,
      skip:0
    });
    
    return diaries

  }
}
