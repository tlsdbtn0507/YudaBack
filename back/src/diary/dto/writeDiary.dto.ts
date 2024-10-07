import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength } from "class-validator";
import { Days } from "src/configs/weathers.model";

export class WriteDiaryDTO {
  @IsNotEmpty()
  @MaxLength(300, {
    message:"내용 제한 초과"
  })
  feelingReason:string
  
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, {
    message:'날짜 형식 오류'
  })
  diaryDate: string

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  long: number;

}