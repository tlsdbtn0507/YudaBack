import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserEntity } from "src/user/user.entity";
import { Request } from "express";
import { Repository } from "typeorm";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(
    @InjectRepository(UserEntity)
    private userService: Repository<UserEntity>,
  ) {
    super(
      {
        secretOrKey: process.env.JWT_SECRET_KEY,
        ignoreExpiration:false,
        jwtFromRequest: ExtractJwt.fromExtractors([(req:Request) => req.cookies['Auth']])
      })
     }
  async validate(payload) {
    const { id } = payload;
    const user: UserEntity = await this.userService.findOne({ where: { userId:id } });
    
    if (!user) throw new UnauthorizedException();
    return user
  }
}