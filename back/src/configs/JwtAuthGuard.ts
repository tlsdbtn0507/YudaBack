import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtAuthGuard implements CanActivate{
  constructor(private jwtService: JwtService, private userService: UserService) { }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    
    if (!authorization) {
      return false;
    }

    const token = authorization.split(' ')[1];
    try {
      const { id } = this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY });
      const user = this.userService.findUserById(id);

      if (!user) return false;
      request.user = user;
      return true
    } catch (error) {
      throw new Error('JwtAuthGuard 오류');
    }

  }

}