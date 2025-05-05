import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  UseGuards,
} from "@nestjs/common";
import { DiaryService } from "./diary.service";
import { WriteDiaryDTO } from "./dto/writeDiary.dto";
import { UserEntity } from "src/user/user.entity";
import { JwtAuthGuard } from "src/configs/JwtAuthGuard";
import { GetUser } from "src/decorators/get-user.decorator";
import { UpdateDiaryDTO } from "./dto/updateDiary.dto";

class TodayDiaryDTO {
  diaryDate: string;
}


@Controller("/api/diary")
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(private diaryService: DiaryService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async writeOrUpdateDiary(
    @Body() diaryDto: WriteDiaryDTO | UpdateDiaryDTO,
    @GetUser() user: UserEntity
  ) {
    const isDiaryExist = await this.diaryService.checkIsDiaryExist(diaryDto, user);

    if (!isDiaryExist) {
      const writeDiaryDTO = diaryDto as WriteDiaryDTO;
      return await this.diaryService.writeDiary(writeDiaryDTO, user);
    }
    
    const updateDiaryDTO = diaryDto as UpdateDiaryDTO;
    return await this.diaryService.updateDiary(updateDiaryDTO,isDiaryExist, user);
  }


  @Post("/today")
  async getDiaryByToday(
    @Body() body: TodayDiaryDTO,
    @GetUser() user: UserEntity
  ) {
    return await this.diaryService.getDiaryByToday(user, body.diaryDate);
  }

  @Get()
  async getDiaries(@GetUser() user: UserEntity) {
    return await this.diaryService.getDiaries(user);
  }

  @Get("/:id")
  async getMoreDiaries(@GetUser() user: UserEntity, @Param("id") id: number) {
    return await this.diaryService.getMoreDiaries(user, id);
  }
}
