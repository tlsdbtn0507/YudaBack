import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { JwtStrategy } from 'src/configs/jwt-strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenMiddleWare } from 'src/configs/refreshMiddleWare';

@Module({
  imports: [
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService,JwtStrategy,RefreshTokenMiddleWare],
  exports:[JwtStrategy,PassportModule,UserService]
})
export class UserModule {}
