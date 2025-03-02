import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { CreateUserDto } from "./dto/createUser.Dto";
import { SignUserDto } from "./dto/signUserDto";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userService: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { userId, name, pw } = createUserDto;

    const salt = await bcrypt.genSalt();

    const hashedPw = await bcrypt.hash(pw, salt);

    const user = this.userService.create({ userId, name, pw: hashedPw });

    try {
      await this.userService.save(user);
      return user;
    } catch (error) {
      if (error.code === "23505")
        throw new ConflictException("이미 존재하는 아이디입니다");
      else throw new InternalServerErrorException();
    }
  }

  async checkIdDuple(id: string) {
    const isIdDuple = await this.userService.findOne({ where: { userId: id } });
    return isIdDuple === null ? true : false;
  }

  async login(signUserDto: SignUserDto) {
    const { id, pw } = signUserDto;
    const getUser = await this.userService.findOne({ where: { userId: id } });

    if (getUser && (await bcrypt.compare(pw, getUser.pw))) {
      const payload = { nickName: id, name: getUser.name };

      const refreshToken = this.jwtService.sign({
        nickName: id,
        expiresIn: process.env.JWT_EXPIRES_ACCESS,
      });
      const accessToken = this.jwtService.sign(payload);

      await this.userService.update({ id: getUser.id }, { refreshToken });

      return { accessToken, refreshToken };
    } else throw new UnauthorizedException("로그인 실패");
  }

  async renewToken(token: { refreshToken: string }, user: UserEntity) {
    const { refreshToken } = token;
    const checkToken = await this.userService.findOne({
      where: { refreshToken },
    });

    if (checkToken.id !== user.id)
      throw new UnauthorizedException("로그인 유지 불가");

    const accessToken = this.jwtService.sign({
      nickName: checkToken.userId,
      name: checkToken.name,
    });

    if (!accessToken) throw new UnauthorizedException("invalid jwt");

    return { accessToken };
  }

  async refreshAccessToken(isValidRefToken: string) {
    try {
      const user = await this.userService.findOne({
        where: { refreshToken: isValidRefToken },
      });

      if (!user || user.refreshToken !== isValidRefToken) {
        throw new UnauthorizedException("재로그인 필요");
      }

      const newAccessToken = this.jwtService.sign({ nickName: user.userId, name: user.name });

      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(refreshToken: string) {
    const checkToken = await this.userService.findOne({
      where: { refreshToken },
    });

    if (checkToken) {
      await this.userService.update(
        { id: checkToken.id },
        { refreshToken: null }
      );
      return true;
    }

    return false;
  }

  async findUserById(nickName: string): Promise<UserEntity | null> {
    return await this.userService.findOne({ where: { userId: nickName } });
  }
}
