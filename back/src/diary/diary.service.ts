import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryEntity } from './diary.entity';
import { LessThan, Repository } from 'typeorm';
import { WriteDiaryDTO } from './dto/writeDiary.dto';
import { UserEntity } from 'src/user/user.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { time } from 'console';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(DiaryEntity)
    private diaryService: Repository<DiaryEntity>,
    private readonly httpService : HttpService
  ) { }
  private readonly logger = new Logger(DiaryService.name);

  
  async writeDiary(writeDiaryDTO:WriteDiaryDTO,user:UserEntity) {
    const diary = this.diaryService.create({ ...writeDiaryDTO, user });
    
    await this.diaryService.save(diary)

    return diary
  };

  async getRealWeather(lat: number, long: number, diaryDate: string) {
    const localDate = new Date().toLocaleTimeString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour12:false
    });

    const [h, m] = localDate.split(' ');
    const min = m.slice(0, 2);
    console.log(min)
    const hour = +min <=10 ? +h.replace('시', '00')-1 : +h.replace('시', '00');

    const [x] = `${lat}`.split('.')
    const [y] = `${long}`.split('.')

    const { data: { response: { body: { items } } } } =
      await lastValueFrom(this.httpService.get(
      process.env.WEATHER_URL + process.env.WEATHER_KEY +
      '&base_date=' + diaryDate.replaceAll('-', '') + '&base_time=' + hour
      + '&nx=' + x + '&ny=' + y));
    
    console.log(items);
  };


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
