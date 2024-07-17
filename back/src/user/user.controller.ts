import { Body, Controller, Post, UsePipes, ValidationPipe, Res, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.Dto';
import { SignUserDto } from './dto/signUserDto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/configs/get-user.decorator';
import { UserEntity } from './user.entity';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) { }
  
  @Post('/signup')
  @UsePipes(ValidationPipe)
  createUser(@Body() creatUserDto: CreateUserDto) {
    return this.userService.signUp(creatUserDto)
  }

  @Post('/idcheck')
  checkIdDuple(@Body() idCheck: { id: string }) {
    const { id } = idCheck;
    return this.userService.checkIdDuple(id);
  }

  @Post('/login')
  async  login(
    @Res({ passthrough: true }) res: Response,
    @Body() signUserDto: SignUserDto) {
    
    const { accessToken } = await this.userService.login(signUserDto);

    res.cookie('Auth', accessToken, {
      maxAge:+process.env.JWT_EXPIRES_ACCESS,
      httpOnly: true,
      sameSite:'none',
      secure: true
    })

    return this.userService.login(signUserDto);
  }

  @Post('/renew')
  @UseGuards(AuthGuard())
  async renewToken(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
    @Body() token: { refreshToken: string }
  ) {
    try {
      if (!user) {
        console.log('쿠키 문제');
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const result = await this.userService.renewToken(token, user);

      res.cookie('Auth', result.accessToken, {
        maxAge: +process.env.JWT_EXPIRES_ACCESS,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });

      return res.json(result);
    } catch (error) {
      console.error('Error renewing token:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('/logout')
  @UseGuards(AuthGuard())
  async logout(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
    @Body() token: { refreshToken: string }
  ) {
    const result = await this.userService.logout(token, user);
    result && res.cookie('Auth', null, { maxAge: 0 });
    return result
  }

}
