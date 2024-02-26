import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { User as IUser } from '../users/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return req.user;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@User('email') email: string): Promise<IUser> {
    return await this.authService.getUserInfo(email);
  }
}
