import { IsNotEmpty, Matches, MinLength } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  @MinLength(4, {
    message:'아이디는 최소 4자 이상이여야합니다'
  })
  userId: string
  
  @IsNotEmpty()
  @MinLength(6, {
    message:'비밀번호는 6자 이상이어야 합니다'
  })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:'비밀번호는 영문,숫자와 특수문자 포함해야합니다'
  })
  pw: string;
}