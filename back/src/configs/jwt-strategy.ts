import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserEntity } from "src/user/user.entity";
import { Request } from "express";
import { Repository } from "typeorm";
import { UserService } from "src/user/user.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(
    @InjectRepository(UserEntity)
    private userEntityService: Repository<UserEntity>,
    private userService: UserService
  ) {
    super(
      {
        secretOrKey: process.env.JWT_SECRET_KEY,
        ignoreExpiration:false,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      })
     }
  async validate(payload: any, req: Request) {
    console.log(payload,req,'valid에서 걸림')
    const { id } = payload;
    const user: UserEntity = await this.userEntityService.findOne({ where: { userId:id } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const [_, accessToken] = req.headers.authorization?.split(' ');

    if (!accessToken) {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) {
        throw new UnauthorizedException('재 로그인 필요');
      }
      const newAccessToken = await this.userService.refreshAccessToken(refreshToken);
      
      req.headers.authorization = `Bearer ${newAccessToken}`;
    }
    return user;
  }
}