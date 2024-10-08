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
    const { id } = payload;
    const user: UserEntity = await this.userEntityService.findOne({ where: { userId:id } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}