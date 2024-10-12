import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryEntity } from './diary.entity';
import { LessThan, Repository } from 'typeorm';
import { WriteDiaryDTO } from './dto/writeDiary.dto';
import { UserEntity } from 'src/user/user.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CoordService } from 'src/coords/coords.service';


@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(DiaryEntity)
    private diaryService: Repository<DiaryEntity>,
    private readonly httpService: HttpService,
    private readonly coordService: CoordService
  ) { }
  private readonly logger = new Logger(DiaryService.name);

  
  async writeDiary(writeDiaryDTO:WriteDiaryDTO,user:UserEntity) {
    const diary = this.diaryService.create({ ...writeDiaryDTO, user });
    
    await this.diaryService.save(diary)

    return diary
  };

  async getRealWeather(lat: string, long: string, diaryDate: string) {
    const [hour, min] = new Date().toLocaleTimeString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour12:false
    }).split(' ');

    const base_time = + min.slice(0, 2) <= 10 ?
      +hour.replace('시', '00') - 1 :
      +hour.replace('시', min.slice(0, 2));
    
    const base_date = diaryDate.replaceAll('-', '');

    const { x, y } = this.coordService.convertToGrid(lat, long);
    console.log(x,y)
    try {
      const { data: { response: { body: { items } } } } =
        await lastValueFrom(this.httpService.get(
          process.env.WEATHER_URL +
          process.env.WEATHER_KEY +
          `&base_date=${base_date}`+
          `&base_time=${base_time}`+
          `&nx=${x}&ny=${y}`
        ));
      return { x, y, items };
    } catch (error) {
      
    }


    
    
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
