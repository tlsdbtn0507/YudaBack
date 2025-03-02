import { IsNumber } from "class-validator";
import { WriteDiaryDTO } from "./writeDiary.dto";

export class UpdateDiaryDTO extends WriteDiaryDTO {
  @IsNumber()
  id:number
}