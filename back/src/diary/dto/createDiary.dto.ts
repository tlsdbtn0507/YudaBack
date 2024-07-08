import { IsNotEmpty, Matches, MaxLength } from "class-validator";
import { Days } from "src/configs/weathers.model";

export class CreateDiaryDTO {
  @IsNotEmpty()
  @MaxLength(7, {
    message:'제목 제한 초과'
  })
  diaryTitle:string
  
  @IsNotEmpty()
  @MaxLength(300, {
    message:"내용 제한 초과"
  })
  diaryContent:string
  
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, {
    message:'날짜 형식 오류'
  })
  diaryDate: string

  @IsNotEmpty()
  // @ArrayNotContains()
  diaryDay: Days
  
  temp: number

  rain: number
  
  main: string
}