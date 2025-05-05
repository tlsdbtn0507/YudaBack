import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DiaryEntity } from "./diary.entity";
import { LessThan, Raw, Repository } from "typeorm";
import { WriteDiaryDTO } from "./dto/writeDiary.dto";
import { UserEntity } from "src/user/user.entity";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom, merge } from "rxjs";
import { CoordService } from "src/coords/coords.service";
import { makeWeatherURL } from "src/util/constantsUtil";
import { baseTimeDateMaker } from "src/util/dateUtil";
import { ErrorHandler } from "src/util/errorHandlers";
import { UpdateDiaryDTO } from "./dto/updateDiary.dto";
// import _merge from "lodash/merge";
import * as _ from "lodash";

type WeatherData = {
  rainCod: string;
  temp: string;
  rainAmount: string;
  humidity: string;
};

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(DiaryEntity)
    private diaryService: Repository<DiaryEntity>,
    private readonly httpService: HttpService,
    private readonly coordService: CoordService
  ) {}
  private readonly logger = new Logger(DiaryService.name);

  async checkIsDiaryExist(
    writeDiaryDTO: WriteDiaryDTO,
    user: UserEntity
  ): Promise<number | null> {
    try {
      const { id } = user;
      const { diaryDate } = writeDiaryDTO;

      const isDiaryExist = await this.diaryService.findOne({
        where: {
          user: { id },
          diaryDate,
        },
      });

      return isDiaryExist?.id || null;
    } catch (error) {
      throw new ErrorHandler("FETCH_DATA");
    }
  }

  async writeDiary(writeDiaryDTO: WriteDiaryDTO, user: UserEntity) {
    const realWeather = (await this.getRealWeather(
      writeDiaryDTO.lat,
      writeDiaryDTO.long,
      writeDiaryDTO.diaryDate.replaceAll("-", "")
    )) as WeatherData;

    try {
      const diary = this.diaryService.create({
        ...writeDiaryDTO,
        ...realWeather,
        user,
      });

      await this.diaryService.save(diary);

      return { result: true, type: "write" };
    } catch (error) {
      throw new ErrorHandler("SAVE_DATA");
    }
  }

  async updateDiary(updateDiaryDTO: UpdateDiaryDTO,diaryIdToUpdate:number, user: UserEntity) {
    const { id: diaryIdToChange } = updateDiaryDTO;
    try {
      const diaryToBeChanged = await this.getSpecificDiary(diaryIdToUpdate, user);

      _.merge(diaryToBeChanged, updateDiaryDTO);

      await this.diaryService.save(diaryToBeChanged);

      return { result: true, type: "update" };
    } catch (error) {
      throw new ErrorHandler("UPDATE_DATA");
    }
  }

  async getSpecificDiary(diaryId: number, user: UserEntity) {
    try {
      const specificDiary = await this.diaryService.findOneOrFail({ where: { id: diaryId, user: { id: user.id } } });
      return specificDiary;
    } catch (error) {
      throw new ErrorHandler("NOT_FOUND");
    }
  }

  async getRealWeather(lat: string, long: string, diaryDate: string) {
    const [base_time, base_date] = baseTimeDateMaker(diaryDate);
    const { x, y } = this.coordService.convertToGrid(lat, long);

    try {
      const WEATHER_URL_STRING = makeWeatherURL([
        base_date,
        base_time,
        `${x}`,
        `${y}`,
      ]);
      const weatherResponse = await lastValueFrom(
        this.httpService.get(WEATHER_URL_STRING)
      );

      const { data } = weatherResponse;
      const { response } = data;
      const { body } = response;
      const { items } = body;
      const { item } = items;

      const toRet = this.coordService.filterWeatherValues(item);

      return toRet;
    } catch (error) {
      throw new ErrorHandler("WEATHER_API_ERROR");
    }
  }

  async getDiaries(user: UserEntity) {
    try {
      const diaries = await this.diaryService.find({
        where: { user:{ id:user.id} },
        order: { id: "DESC" },
        relations: ["user"],
        take: 5,
        skip: 0,
      });
      const sanitizedDiaries = diaries.map((diary) => {
        const { user, ...diaryWithoutUser } = diary;
        return diaryWithoutUser; // user 필드 제거 후 반환
      });

      return sanitizedDiaries;
    } catch (error) {
      throw new ErrorHandler("FETCH_DATA");
    }
  }

  async getMoreDiaries(user: UserEntity, lessId: number) {
    try {
      const diaries = await this.diaryService.find({
        where: { user, id: LessThan(lessId) },
        order: {
          id: "DESC",
        },
        take: 5,
        skip: 0,
      });

      return diaries;
    } catch (error) {
      throw new ErrorHandler("FETCH_DATA");
    }
  }

  async getDiaryByToday(user: UserEntity, date: string) {
    try {
      const [month, day] = date.split("-").slice(1);
      const lastTodayDiary = await this.diaryService.findOne({
        where: {
          user: { id: user.id },
          diaryDate: Raw(
            (alias) =>
              `TO_CHAR(${alias}, 'MM-DD') = '${month}-${day}' AND ${alias} != '${date}'`
          ),
        },
      });
      if (!lastTodayDiary) {
        return false;
      }
    } catch (error) {
      throw new ErrorHandler("FETCH_DATA_TODAY");
    }
  }
}
