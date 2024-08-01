import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/user/user.service";

@Injectable()
export class RefreshTokenMiddleWare implements NestMiddleware {
  constructor(private userService: UserService) { }
  
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies['refreshToken'];

    if (authHeader && !refreshToken) throw new UnauthorizedException('No refreshToken');

    if (!authHeader) throw new UnauthorizedException('No AccesToken in Header');

    const [_, accessToken] = req.headers.authorization?.split(' ');

    if (!accessToken) {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) {
        throw new UnauthorizedException('재 로그인 필요');
      }
      const newAccessToken = await this.userService.refreshAccessToken(refreshToken);
      
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);

    }
    next();
  };
}