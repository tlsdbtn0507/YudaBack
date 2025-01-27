import { IsNotEmpty, IsObject, Matches, MaxLength } from "class-validator";
import { Days } from "src/types/weathers.model";

export class WriteDiaryDTO {
  @IsObject()
  @IsNotEmpty()
  feeling: {
    ment: string;
    level: number;
  };

  @IsObject()
  @IsNotEmpty()
  weather: {
    weatherCond: string;
    weatherLevel: {
      ment: string;
      level: number;
    };
  };

  @IsNotEmpty()
  @MaxLength(300, {
    message: "내용 제한 초과",
  })
  feelingReason: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, {
    message: "날짜 형식 오류",
  })
  diaryDate: string;

  @IsNotEmpty()
  dayOfWeek: Days;

  @IsNotEmpty()
  lat: string;

  @IsNotEmpty()
  long: string;
}
