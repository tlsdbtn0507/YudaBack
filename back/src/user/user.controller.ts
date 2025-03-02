import { Body, Controller, Post, UsePipes, ValidationPipe, Res, Req} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.Dto';
import { SignUserDto } from './dto/signUserDto';
import { Request, Response } from 'express';
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
    
    try {
      const { accessToken,refreshToken } = await this.userService.login(signUserDto);
      setCookie(res, 'refreshToken', refreshToken);
      res
        .status(200)
        .json({ message: "Login successful", result: true, accessToken });
      return { accessToken };
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Login fail", result: false });
    }
  }

  @Post('/renew')
  async renewToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req : Request
  ) {
    const token = req.cookies['refreshToken'];
    if (!token) return res.status(501).send({ message: '새로 로그인 해야함' });
    
    const result = await this.userService.refreshAccessToken(token)
    
    setCookie(res, 'refreshToken', token);
    
    return { accessToken: result };
  }

  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req : Request
  ) {
    const token = req.cookies['refreshToken'];
    const result = await this.userService.logout(token);

    if (!token) {
      return res.status(400).send({ message: 'No refresh token provided' });
    }
    if (result) {
      res.clearCookie('refreshToken');
      res.status(200).send({ message: 'Logout successful', result: true });
    } else {
      res.status(401).send({ message: 'Logout failed', result: false });
    }
  }

}
