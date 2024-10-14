import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryEntity } from './diary.entity';
import { LessThan, Repository } from 'typeorm';
import { WriteDiaryDTO } from './dto/writeDiary.dto';
import { UserEntity } from 'src/user/user.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CoordService } from 'src/coords/coords.service';

type WeatherData = {
  rainCod:string,
  temp:string,
  rainAmount:string,
  humidity:string,
}


@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(DiaryEntity)
    private diaryService: Repository<DiaryEntity>,
    private readonly httpService: HttpService,
    private readonly coordService: CoordService
  ) { }
  private readonly logger = new Logger(DiaryService.name);

  
  async writeDiary(writeDiaryDTO: WriteDiaryDTO, user: UserEntity) {
    const { lat, long, diaryDate } = writeDiaryDTO;
    const realWeather = await this.getRealWeather(lat, long, diaryDate) as WeatherData;

    let diary: DiaryEntity;

    try {
      diary = this.diaryService.create({ ...writeDiaryDTO, ...realWeather, user });      
    } catch (error) {
      throw new HttpException(
        'Failed to create diary entry. Please check the input data and try again.',
        HttpStatus.BAD_REQUEST
      );      
    }
    try {
      await this.diaryService.save(diary);
    } catch (error) {
      throw new HttpException(
        'Failed to save diary entry. Please try again later.', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return diary
  };

  async getRealWeather(lat: string, long: string, diaryDate: string) {
    let [hour, min] = new Date().toLocaleTimeString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour12:false
    }).split(' ');

    hour = hour === '24시' ? '00시' : hour;

    const base_time = + min.replace('분', '') <= 10 ?
      hour.replace('시', '') + '00':
      hour.replace('시', min.slice(0, 2));
    
    const base_date = diaryDate.replaceAll('-', '');

    const { x, y } = this.coordService.convertToGrid(lat, long);

    try {
      const { data: { response: { body: { items: { item } } } } } =
        await lastValueFrom(this.httpService.get(
          process.env.WEATHER_URL +
          process.env.WEATHER_KEY +
          `&base_date=${base_date}` +
          `&base_time=${base_time}` +
          `&nx=${x}&ny=${y}`
        ));
      const toRet = this.coordService.filterWeatherValues(item);
      return toRet;

    } catch (error) {
      throw new HttpException('Failed to fetch weather data from external API', 500);
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
