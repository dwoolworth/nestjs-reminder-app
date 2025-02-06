import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const { access_token } = await this.authService.login(user);
    response.cookie('refreshToken', user.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      // secure: true, // uncomment in production
      // sameSite: 'strict', // uncomment in production
    });

    return { access_token };
  }
}
