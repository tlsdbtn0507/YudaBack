import { IsNotEmpty } from "class-validator";

export class SignUserDto{
  @IsNotEmpty()
  id:string
    
  @IsNotEmpty()
  pw:string
}