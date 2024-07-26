import { Body, Controller, Post, UsePipes, ValidationPipe, Res, UseGuards, Req} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.Dto';
import { SignUserDto } from './dto/signUserDto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/configs/get-user.decorator';
import { UserEntity } from './user.entity';
import setCookie from 'src/util/cookieUtil';

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

    setCookie(res, 'refreshToken', accessToken);
    res.setHeader('Authorization', `Bearer ${accessToken}`);

    return this.userService.login(signUserDto);
  }

  @Post('/renew')
  @UseGuards(AuthGuard())
  async renewToken(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
    @Body() token: { refreshToken: string }
  ) {

      const result = await this.userService.renewToken(token, user);

      setCookie(res, 'refreshToken', result.accessToken);

      return result;
  }

  @Post('/logout')
  @UseGuards(AuthGuard())
  async logout(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
    @Req() req : Request
  ) {
    const token = req.cookies['refreshToken'];
    const result = await this.userService.logout(token, user);

    if (!token) {
      return res.status(400).send({ message: 'No refresh token provided' });
    }
    
    if (result) {
      res.clearCookie('refreshToken');
      res.status(200).send({ message: 'Logout successful' });
    } else {
      res.status(401).send({ message: 'Logout failed' });
    }
  }

}
